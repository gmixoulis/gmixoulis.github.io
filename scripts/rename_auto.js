const fs = require('node:fs');
const path = require('node:path');
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require('@google/genai');
const { withRetry, sanitizeForLog } = require('./lib/retry');

// ---------------------------------------------------------------------------
// Configuration (all overridable via env in CI)
// ---------------------------------------------------------------------------
// Primary vision model: Gemini 2.5 Flash-Lite (cheapest, fastest, image-capable).
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 6); // per HTTP call
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 90000); // 90s per call
const CONCURRENCY = Number(process.env.GEMINI_CONCURRENCY || 3); // parallel files
const PASSES = Number(process.env.GEMINI_PASSES || 3); // retry failed files in passes
const BASE_BACKOFF_MS = Number(process.env.GEMINI_BACKOFF_MS || 5000);
const MAX_BACKOFF_MS = Number(process.env.GEMINI_MAX_BACKOFF_MS || 120000);

// DeepSeek fallback (text-only, OpenAI-compatible). Runs ONLY for files that
// Gemini could not process after all passes, so we never leave a certificate
// unnamed. DeepSeek has no vision, so it labels from the original filename.
// Uses deepseek-v4-flash (cheapest model) with thinking DISABLED for the
// lowest cost & latency on this trivial filename-labeling task.
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_TIMEOUT_MS = Number(process.env.DEEPSEEK_TIMEOUT_MS || 60000);
// One fallback pass is enough (text calls are cheap & fast); the heuristic
// layer below is the hard guarantee that always succeeds.
const DEEPSEEK_PASSES = Number(process.env.DEEPSEEK_PASSES || 1);

// Ollama fallback (text-only). Tried BEFORE DeepSeek so we prefer Ollama
// (free locally, or cheap via Ollama Cloud) over paying DeepSeek. Labels from
// the filename (no vision). Two modes, chosen automatically by the presence of
// the OLLAMA_API_KEY secret:
//   - Cloud:  host https://ollama.com, Authorization: Bearer <key>, default
//             model gemma3:4b. No local install needed -> great for CI.
//   - Local:  host http://localhost:11434, no auth, default model qwen3:1.7b.
//             Requires `ollama serve` + a pulled model (the workflow does this
//             when no cloud key is set).
// OLLAMA_HOST / OLLAMA_MODEL / OLLAMA_HEADERS override the auto defaults. The
// stage self-skips if the SDK is missing or the server is unreachable.
const OLLAMA_ENABLED = String(process.env.OLLAMA_ENABLED || 'true').toLowerCase() !== 'false';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || '';
const OLLAMA_CLOUD = !!OLLAMA_API_KEY;
const OLLAMA_HOST =
  process.env.OLLAMA_HOST || (OLLAMA_CLOUD ? 'https://ollama.com' : 'http://localhost:11434');
const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL || (OLLAMA_CLOUD ? 'gemma3:4b' : 'qwen3:1.7b');
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 60000);
const OLLAMA_PASSES = Number(process.env.OLLAMA_PASSES || 1);
let _ollamaClient = null;
let _ollamaAvailable = null; // tri-state: null=unknown, true, false

// Build auth headers: Bearer key (cloud) merged with any explicit OLLAMA_HEADERS.
function ollamaHeaders() {
  let h = {};
  if (OLLAMA_API_KEY) h.Authorization = `Bearer ${OLLAMA_API_KEY}`;
  if (process.env.OLLAMA_HEADERS) {
    try {
      h = { ...h, ...JSON.parse(process.env.OLLAMA_HEADERS) };
    } catch {}
  }
  return Object.keys(h).length ? h : undefined;
}

function getOllamaClient() {
  if (_ollamaClient) return _ollamaClient;
  let Ollama;
  try {
    // ollama ships a CJS build, so require() works from this CommonJS script.
    Ollama = require('ollama').Ollama;
  } catch {
    _ollamaAvailable = false;
    return null;
  }
  _ollamaClient = new Ollama({ host: OLLAMA_HOST, headers: ollamaHeaders() });
  return _ollamaClient;
}

const originalImagesFolder = path.resolve(__dirname, '../public/img/certificates');
const renamedImagesFolder = path.resolve(__dirname, '../public/img/renamed');
const manifestPath = path.resolve(__dirname, '../.cert-manifest.json');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: REQUEST_TIMEOUT_MS },
});

// ---------------------------------------------------------------------------
// MIME lookup without an external dependency (we only handle image types)
// ---------------------------------------------------------------------------
const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};
const lookupMime = (filePath) =>
  MIME_BY_EXT[path.extname(filePath).toLowerCase()] || 'image/jpeg';

// Run async tasks with a bounded concurrency pool.
async function pool(items, limit, worker) {
  const queue = items.map((item, index) => ({ item, index }));
  const results = new Array(items.length);
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (queue.length) {
        const { item, index } = queue.shift();
        results[index] = await worker(item, index);
      }
    })
  );
  return results;
}

// ---------------------------------------------------------------------------
// Manifest: lets a re-run (e.g. after a previous timeout) skip files already
// processed, so we don't burn Gemini quota re-doing completed work.
// ---------------------------------------------------------------------------
function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) || {};
  } catch {
    return {};
  }
}
function saveManifest(manifest) {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

// ---------------------------------------------------------------------------
// Name formatting (unchanged business logic)
// ---------------------------------------------------------------------------
const formatPart = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[Α-Ωα-ωάέήίύόώϊϋΐΰ]+/g, '') // remove Greek letters
    .replace(/[^a-zA-Z0-9 ]+/g, '') // remove symbols
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 8) // limit word count
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');

const PROMPT = `
You're analyzing an academic or professional certificate.

If the document is an official **degree** (e.g. Bachelor or Master), classify it as:
- 1Bachelor Degree
- 1Master Degree

 If the document is Move Bootcamp  classify it as:
- Move Sui first Thessaloniki Bootacamp  Award


If it's an **English language proficiency certificate**, use:
- English Certificate

Other options:
- Certificate of Completion
- Certificate of Participation
- Certificate of Achievement
- Award

Respond in exactly this format:
Certificate Type: <value>
Topic: <value>

Be specific. Avoid vague labels like "Copy of Diploma" or "Certificate of Completion" for real degrees.
If the document is issued by a university, it's likely a degree.
Use clear English only. Do not include Greek or date ranges.
`;

// ---------------------------------------------------------------------------
// Classifiers
// ---------------------------------------------------------------------------
// PRIMARY: Gemini vision classification.
async function classifyWithGemini(filePath, mimeType) {
  const upload = await withRetry(`upload ${path.basename(filePath)}`, () =>
    ai.files.upload({ file: filePath, config: { mimeType } })
  );

  const response = await withRetry(
    `classify ${path.basename(filePath)}`,
    () =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: createUserContent([
          createPartFromUri(upload.uri, mimeType),
          PROMPT,
        ]),
      })
  );

  const text = (response.text || '').trim();
  const parsed = parseCertificateResponse(text);

  // Fallback when Gemini didn't follow the requested format.
  if (!parsed.titleRaw || !parsed.altRaw) {
    const fallbackResponse = await withRetry(
      `fallback ${path.basename(filePath)}`,
      () =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: createUserContent([
            createPartFromUri(upload.uri, mimeType),
            'Provide a clean English label for this certificate (Title Case, max 6 words)',
          ]),
        })
    );
    const fallback = (fallbackResponse.text || '').trim() || 'Certificate';
    parsed.titleRaw = parsed.titleRaw || fallback;
    parsed.altRaw = parsed.altRaw || fallback;
  }

  return parsed;
}

// Parse "Certificate Type: x\nTopic: y" into { titleRaw, altRaw }.
function parseCertificateResponse(text) {
  const lines = String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  let titleRaw = null;
  let altRaw = null;
  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    if (!rest.length) continue;
    const value = rest.join(':').trim();
    if (/certificate type/i.test(key)) titleRaw = value;
    if (/topic/i.test(key)) altRaw = value;
  }
  return { titleRaw, altRaw };
}

// FALLBACK 1: DeepSeek (text-only). Labels from the original filename since it
// cannot see the image. Returns { titleRaw, altRaw } or throws on failure.
async function classifyWithDeepSeek(filename) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY not set');
  }

  // deepseek-v4-flash defaults to thinking mode (enabled). Disable it for the
  // cheapest/fastest path on this trivial classification. Also keep max_tokens
  // small since we only need two short lines.
  const body = {
    model: DEEPSEEK_MODEL,
    thinking: { type: 'disabled' },
    messages: [
      {
        role: 'system',
        content:
          'You label academic/professional certificate files from their filename. ' +
          'Reply in EXACTLY two lines: "Certificate Type: <value>" and "Topic: <value>". ' +
          'Use only these types when appropriate: 1Bachelor Degree, 1Master Degree, ' +
          'English Certificate, Certificate of Completion, Certificate of Participation, ' +
          'Certificate of Achievement, Award, Move Sui first Thessaloniki Bootcamp Award. ' +
          'Clean English only, no Greek, no dates, max 6 words for the topic.',
      },
      {
        role: 'user',
        content: `Filename: ${filename}\nGuess the certificate type and topic.`,
      },
    ],
    temperature: 0,
    max_tokens: 80,
    stream: false,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);
  try {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`DeepSeek HTTP ${res.status}: ${sanitizeForLog(errText)}`);
    }
    const data = await res.json();
    const text =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      '';
    const parsed = parseCertificateResponse(text);
    if (!parsed.titleRaw || !parsed.altRaw) {
      throw new Error('DeepSeek response did not contain the expected fields');
    }
    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

// FALLBACK 2 (hard guarantee): deterministic keyword heuristic from the
// filename. Never throws, never needs a network call. Ensures every file ends
// up renamed even if both Gemini and DeepSeek are unavailable.
function classifyWithHeuristic(filename) {
  const base = path.basename(filename, path.extname(filename));
  const name = base.toLowerCase();

  const rules = [
    { test: /master/, title: '1Master Degree', topic: 'Master Degree' },
    {
      test: /uom|bachelor|diploma/,
      title: '1Bachelor Degree',
      topic: 'Bachelor Degree',
    },
    {
      test: /move.?sui|bootcamp/,
      title: 'Move Sui first Thessaloniki Bootcamp Award',
      topic: 'Move Sui Bootcamp Thessaloniki',
    },
    { test: /ecpe|english|proficiency|cpe|ecce/, title: 'English Certificate', topic: 'English Proficiency' },
    { test: /attendance|attend/, title: 'Certificate of Attendance', topic: 'Attendance' },
    { test: /participation/, title: 'Certificate of Participation', topic: 'Participation' },
    { test: /achievement/, title: 'Certificate of Achievement', topic: 'Achievement' },
    { test: /award/, title: 'Award', topic: 'Award' },
    { test: /mooc/, title: 'Certificate of Completion', topic: 'MOOC Course' },
    { test: /cloud/, title: 'Certificate of Completion', topic: 'Cloud Engineering' },
    { test: /cvml/, title: 'Certificate of Completion', topic: 'CVML' },
    { test: /hydrobot/, title: 'Certificate of Participation', topic: 'Hydrobot' },
    { test: /pepsico/, title: 'Certificate of Completion', topic: 'Pepsico' },
    { test: /bebaisi|verification/, title: 'Certificate of Completion', topic: 'Verification' },
  ];

  for (const r of rules) {
    if (r.test.test(name)) return { titleRaw: r.title, altRaw: r.topic };
  }

  // Generic: title-case the filename tokens.
  const topic = base
    .replace(/[_\-]+/g, ' ')
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 6)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    titleRaw: 'Certificate of Completion',
    altRaw: topic || 'Certificate',
  };
}

// ---------------------------------------------------------------------------
// Ollama classifier (text-only, free/local). Same filename-labeling task as
// DeepSeek but preferred because it costs nothing when a local server exists.
// Quick connectivity preflight so we don't per-file-timeout on a dead server.
async function ollamaReachable() {
  if (_ollamaAvailable !== null) return _ollamaAvailable;
  if (!OLLAMA_ENABLED) { _ollamaAvailable = false; return false; }
  const client = getOllamaClient();
  if (!client) { _ollamaAvailable = false; return false; }
  try {
    // Raw fetch to /api/tags (what client.list() calls internally) so we can
    // attach a real AbortSignal timeout (list() does not accept one).
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(OLLAMA_TIMEOUT_MS, 8000));
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
      headers: ollamaHeaders(),
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    _ollamaAvailable = true;
    return true;
  } catch (err) {
    console.warn(
      `  ⚠️  Ollama not reachable at ${OLLAMA_HOST}: ${sanitizeForLog(err?.message ?? err)}. ` +
        `Skipping Ollama stage.`
    );
    _ollamaAvailable = false;
    return false;
  }
}

async function classifyWithOllama(filename) {
  const client = getOllamaClient();
  if (!client) throw new Error('Ollama SDK unavailable');
  const response = await client.chat({
    model: OLLAMA_MODEL,
    stream: false,
    think: false, // disable qwen3 reasoning for speed on this trivial task
    options: { temperature: 0 },
    messages: [
      {
        role: 'system',
        content:
          'You label academic/professional certificate files from their filename. ' +
          'Reply in EXACTLY two lines: "Certificate Type: <value>" and "Topic: <value>". ' +
          'Use only these types when appropriate: 1Bachelor Degree, 1Master Degree, ' +
          'English Certificate, Certificate of Completion, Certificate of Participation, ' +
          'Certificate of Achievement, Award, Move Sui first Thessaloniki Bootcamp Award. ' +
          'Clean English only, no Greek, no dates, max 6 words for the topic.',
      },
      {
        role: 'user',
        content: `Filename: ${filename}\nGuess the certificate type and topic.`,
      },
    ],
  });
  const text = response?.message?.content || '';
  const parsed = parseCertificateResponse(text);
  if (!parsed.titleRaw || !parsed.altRaw) {
    throw new Error('Ollama response did not contain the expected fields');
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Shared finalize: take raw {titleRaw, altRaw} and produce the renamed file.
// ---------------------------------------------------------------------------
const seenPairs = new Map();

async function finalizeRename(filename, titleRaw, altInitial, manifest) {
  const filePath = path.join(originalImagesFolder, filename);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext).toLowerCase();

  let titleRaw2 = titleRaw;
  let altRaw = altInitial;
  if (baseName.includes('master')) titleRaw2 = '1Master Degree';
  if (baseName.includes('uom') || baseName.includes('bachelor'))
    titleRaw2 = '1Bachelor Degree';

  const academicTypes = [
    '1Bachelor Degree',
    '1Master Degree',
    'English Certificate',
    'Certificate of Proficiency in English',
  ];
  if (academicTypes.includes(titleRaw2)) {
    altRaw = `${titleRaw2} ${altRaw}`;
  }

  // Dedup across this run
  if (!seenPairs.has(titleRaw2.toLowerCase())) seenPairs.set(titleRaw2.toLowerCase(), 0);
  const pairKey = `${titleRaw2.toLowerCase()}|${altRaw.toLowerCase()}`;
  const count = seenPairs.get(pairKey) || 0;
  seenPairs.set(pairKey, count + 1);
  let altDedup = altRaw;
  if (count > 0) altDedup = `${altRaw} ${count + 1}`;

  const title = formatPart(titleRaw2);
  let alt = formatPart(altDedup);
  if (alt.includes('1')) alt = alt.replace(/(\d+)/g, '');

  if (titleRaw2.includes('Master')) {
    altDedup = altDedup
      .replace(
        /data[-\s]*science[-\s]*(and)?[-\s]*(the)?[-\s]*(global|world[-\s]*wide)?[-\s]*(web|internet)?/i,
        'Data and Web Science'
      )
      .replace(/data[-\s]*science[-\s]*(and)?[-\s]*(web)*science?/i, 'Data and Web Science')
      .replace(/web[-\s]*(and)?[-\s]*data[-\s]*science/i, 'Data and Web Science')
      .replace(/science[-\s]*(and)?[-\s]*(web|internet)/i, 'Data and Web Science');
    alt = formatPart(altDedup);
  }

  const newFileName = `${title}_${alt}${ext}`;
  const newFilePath = path.join(renamedImagesFolder, newFileName);

  fs.copyFileSync(filePath, newFilePath);
  manifest[filename] = newFileName;
  saveManifest(manifest);
  console.log(`✅ ${filename} → ${newFileName}`);
  return { filename, newFileName };
}

// Per-file pipeline using Gemini (primary).
async function renameWithGemini(filename, manifest) {
  const filePath = path.join(originalImagesFolder, filename);
  const mimeType = lookupMime(filePath);

  if (manifest[filename]) {
    console.log(`⏭️  ${filename} already processed, skipping`);
    return { filename, skipped: true };
  }

  const { titleRaw, altRaw } = await classifyWithGemini(filePath, mimeType);
  return finalizeRename(filename, titleRaw, altRaw, manifest);
}

// Per-file pipeline using Ollama (free/local fallback). Throws on failure so
// the caller can route the file to the next stage (DeepSeek); it does NOT
// silently fall back to the heuristic here.
async function renameWithOllama(filename, manifest) {
  if (manifest[filename]) {
    console.log(`⏭️  ${filename} already processed, skipping`);
    return { filename, skipped: true };
  }
  const parsed = await classifyWithOllama(filename);
  const result = await finalizeRename(filename, parsed.titleRaw, parsed.altRaw, manifest);
  return { ...result, source: 'ollama' };
}

// Per-file pipeline using DeepSeek (cheap cloud fallback). Throws on failure so
// the caller can route the file to the final heuristic guarantee stage.
async function renameWithDeepSeek(filename, manifest) {
  if (manifest[filename]) {
    console.log(`⏭️  ${filename} already processed, skipping`);
    return { filename, skipped: true };
  }
  const parsed = await classifyWithDeepSeek(filename);
  const result = await finalizeRename(filename, parsed.titleRaw, parsed.altRaw, manifest);
  return { ...result, source: 'deepseek' };
}

// ---------------------------------------------------------------------------
// Main: Gemini passes -> Ollama fallback -> DeepSeek fallback -> heuristic guarantee.
// ---------------------------------------------------------------------------
async function run() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set');
    process.exit(2);
  }

  fs.mkdirSync(renamedImagesFolder, { recursive: true });
  const manifest = loadManifest();

  const allFiles = fs
    .readdirSync(originalImagesFolder)
    .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

  // Files that still need processing (skip ones already in the manifest)
  let pending = allFiles.filter((f) => !manifest[f]);
  console.log(
    `📦 ${allFiles.length} certificates total, ${pending.length} pending, ` +
      `${allFiles.length - pending.length} already done`
  );

  if (pending.length === 0) {
    console.log('🎉 Nothing to do — all certificates already renamed.');
    return;
  }

  console.log(`\n🌐 Primary model: ${MODEL_NAME}`);

  // ---- Stage 1: Gemini passes -------------------------------------------
  let pass = 0;
  let failures = [];
  while (pending.length && pass < PASSES) {
    pass++;
    console.log(`\n=== Gemini Pass ${pass}/${PASSES}: ${pending.length} files ===`);
    failures = [];
    const results = await pool(pending, CONCURRENCY, async (filename) => {
      try {
        return await renameWithGemini(filename, manifest);
      } catch (err) {
        console.error(`❌ ${filename}: ${sanitizeForLog(err?.message ?? err)}`);
        failures.push(filename);
        return { filename, error: true };
      }
    });
    pending = failures;
    console.log(
      `Pass ${pass} done: ${results.filter((r) => !r.error && !r.skipped).length} ok, ` +
        `${failures.length} failed`
    );
  }

  // ---- Stage 2: Ollama fallback (free/local) ---------------------------
  if (pending.length && (await ollamaReachable())) {
    let ollamaPass = 0;
    while (pending.length && ollamaPass < OLLAMA_PASSES) {
      ollamaPass++;
      console.log(
        `\n=== Ollama fallback ${ollamaPass}/${OLLAMA_PASSES} (${OLLAMA_MODEL}): ` +
          `${pending.length} files ===`
      );
      const stillFailing = [];
      const results = await pool(pending, CONCURRENCY, async (filename) => {
        try {
          return await renameWithOllama(filename, manifest);
        } catch (err) {
          console.error(`❌ ${filename}: ${sanitizeForLog(err?.message ?? err)}`);
          stillFailing.push(filename);
          return { filename, error: true };
        }
      });
      pending = stillFailing;
      console.log(
        `Ollama pass ${ollamaPass} done: ` +
          `${results.filter((r) => !r.error && !r.skipped).length} ok, ` +
          `${stillFailing.length} still failing`
      );
    }
  } else if (pending.length) {
    console.log('\n⏭️  Ollama stage skipped (unavailable or disabled).');
  }

  // ---- Stage 3: DeepSeek fallback (cheap cloud) ------------------------
  let deepseekPass = 0;
  while (pending.length && deepseekPass < DEEPSEEK_PASSES) {
    deepseekPass++;
    console.log(
      `\n=== DeepSeek fallback ${deepseekPass}/${DEEPSEEK_PASSES} (${DEEPSEEK_MODEL}): ` +
        `${pending.length} files ===`
    );
    const stillFailing = [];
    const results = await pool(pending, CONCURRENCY, async (filename) => {
      try {
        return await renameWithDeepSeek(filename, manifest);
      } catch (err) {
        console.error(`❌ ${filename}: ${sanitizeForLog(err?.message ?? err)}`);
        stillFailing.push(filename);
        return { filename, error: true };
      }
    });
    pending = stillFailing;
    console.log(
      `DeepSeek pass ${deepseekPass} done: ` +
        `${results.filter((r) => !r.error && !r.skipped).length} ok, ` +
        `${stillFailing.length} still failing`
    );
  }

  // ---- Stage 4: hard heuristic guarantee for anything left --------------
  if (pending.length) {
    console.log(
      `\n🛟 Heuristic guarantee for ${pending.length} remaining files`
    );
    const stillFailing = [];
    for (const filename of pending) {
      try {
        const parsed = classifyWithHeuristic(filename);
        await finalizeRename(filename, parsed.titleRaw, parsed.altRaw, manifest);
      } catch (err) {
        console.error(`❌ ${filename}: ${sanitizeForLog(err?.message ?? err)}`);
        stillFailing.push(filename);
      }
    }
    pending = stillFailing;
  }

  if (pending.length) {
    console.error(
      `\n🛑 ${pending.length} certificates could not be processed:`
    );
    pending.forEach((f) => console.error(`   - ${f}`));
    process.exit(1);
  }
  console.log('\n🎉 All certificates cleaned, translated, renamed, and sorted.');
}

// Export pure helpers for unit testing. When run directly, execute the pipeline.
if (require.main === module) {
  run().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  });
}

module.exports = {
  formatPart,
  parseCertificateResponse,
  classifyWithHeuristic,
  ollamaReachable,
};
