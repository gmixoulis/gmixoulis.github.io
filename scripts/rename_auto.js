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
// Pipeline order per image:  Google Gemini  ->  Ollama  ->  DeepSeek  ->  heuristic.
// Each MODEL is retried up to *_MAX_RETRIES times (default 10) for a given image
// before we cascade to the next model. The heuristic is the never-fail guarantee
// so a certificate is always renamed even if every API is down.

// Google Gemini (primary, vision)
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const GEMINI_MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 10);
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 90000); // 90s per call
const CONCURRENCY = Number(process.env.GEMINI_CONCURRENCY || 3); // parallel files
const BASE_BACKOFF_MS = Number(process.env.GEMINI_BACKOFF_MS || 5000);
const MAX_BACKOFF_MS = Number(process.env.GEMINI_MAX_BACKOFF_MS || 120000);

// Ollama (2nd, text-only; free locally or cheap via Ollama Cloud)
const OLLAMA_ENABLED =
  String(process.env.OLLAMA_ENABLED || 'true').toLowerCase() !== 'false';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || '';
const OLLAMA_CLOUD = !!OLLAMA_API_KEY;
const OLLAMA_HOST =
  process.env.OLLAMA_HOST || (OLLAMA_CLOUD ? 'https://ollama.com' : 'http://localhost:11434');
const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL || (OLLAMA_CLOUD ? 'gemma3:4b' : 'qwen3:1.7b');
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 60000);
const OLLAMA_MAX_RETRIES = Number(process.env.OLLAMA_MAX_RETRIES || 10);
const OLLAMA_BACKOFF_MS = Number(process.env.OLLAMA_BACKOFF_MS || 2000);
const OLLAMA_MAX_BACKOFF_MS = Number(process.env.OLLAMA_MAX_BACKOFF_MS || 30000);

// DeepSeek (3rd / final API fallback, text-only, OpenAI-compatible)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_TIMEOUT_MS = Number(process.env.DEEPSEEK_TIMEOUT_MS || 60000);
const DEEPSEEK_MAX_RETRIES = Number(process.env.DEEPSEEK_MAX_RETRIES || 10);
const DEEPSEEK_BACKOFF_MS = Number(process.env.DEEPSEEK_BACKOFF_MS || 2000);
const DEEPSEEK_MAX_BACKOFF_MS = Number(process.env.DEEPSEEK_MAX_BACKOFF_MS || 30000);

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
// processed, so we don't burn API quota re-doing completed work.
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
// Classifiers (single attempt each; retries are handled by the per-file cascade)
// ---------------------------------------------------------------------------
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

// PRIMARY: Gemini vision classification (single attempt).
async function classifyWithGemini(filePath, mimeType) {
  const upload = await ai.files.upload({ file: filePath, config: { mimeType } });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: createUserContent([createPartFromUri(upload.uri, mimeType), PROMPT]),
  });

  const parsed = parseCertificateResponse((response.text || '').trim());

  // Repair when Gemini didn't follow the requested format (still one attempt).
  if (!parsed.titleRaw || !parsed.altRaw) {
    const fallbackResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: createUserContent([
        createPartFromUri(upload.uri, mimeType),
        'Provide a clean English label for this certificate (Title Case, max 6 words)',
      ]),
    });
    const fallback = (fallbackResponse.text || '').trim() || 'Certificate';
    parsed.titleRaw = parsed.titleRaw || fallback;
    parsed.altRaw = parsed.altRaw || fallback;
  }

  return parsed;
}

// Ollama (text-only, free locally or cheap via Ollama Cloud).
let _ollamaClient = null;
let _ollamaAvailable = null; // tri-state: null=unknown, true, false

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

// Quick connectivity preflight so we don't per-file-timeout on a dead server.
async function ollamaReachable() {
  if (_ollamaAvailable !== null) return _ollamaAvailable;
  if (!OLLAMA_ENABLED) {
    _ollamaAvailable = false;
    return false;
  }
  const client = getOllamaClient();
  if (!client) {
    _ollamaAvailable = false;
    return false;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.min(OLLAMA_TIMEOUT_MS, 8000));
  try {
    // Raw fetch to /api/tags (what client.list() calls internally) so we can
    // attach a real AbortSignal timeout (list() does not accept one).
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
      headers: ollamaHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    _ollamaAvailable = true;
    clearTimeout(timer);
    return true;
  } catch (err) {
    clearTimeout(timer);
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

// DeepSeek (final API fallback, text-only, OpenAI-compatible).
async function classifyWithDeepSeek(filename) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY not set');
  }
  // deepseek-v4-flash defaults to thinking mode (enabled). Disable it for the
  // cheapest/fastest path on this trivial classification.
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
      data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
    const parsed = parseCertificateResponse(text);
    if (!parsed.titleRaw || !parsed.altRaw) {
      throw new Error('DeepSeek response did not contain the expected fields');
    }
    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

// Hard guarantee: deterministic keyword heuristic from the filename. Never
// throws, never needs a network call.
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

  const topic = base
    .replace(/[_-]+/g, ' ')
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

// ---------------------------------------------------------------------------
// Per-file cascade: Google -> Ollama -> DeepSeek -> heuristic.
// Each MODEL is retried up to *_MAX_RETRIES times for this image before we
// fall through to the next model. The heuristic is the never-fail last resort.
// ---------------------------------------------------------------------------
async function classifyWithModel(model, filename, filePath, mimeType) {
  switch (model) {
    case 'gemini':
      return classifyWithGemini(filePath, mimeType);
    case 'ollama':
      return classifyWithOllama(filename);
    case 'deepseek':
      return classifyWithDeepSeek(filename);
    default:
      throw new Error(`Unknown model: ${model}`);
  }
}

const MODEL_STAGES = [
  {
    name: 'gemini',
    label: 'Google Gemini',
    maxRetries: GEMINI_MAX_RETRIES,
    baseMs: BASE_BACKOFF_MS,
    maxMs: MAX_BACKOFF_MS,
    enabled: () => true,
  },
  {
    name: 'ollama',
    label: 'Ollama',
    maxRetries: OLLAMA_MAX_RETRIES,
    baseMs: OLLAMA_BACKOFF_MS,
    maxMs: OLLAMA_MAX_BACKOFF_MS,
    enabled: () => true, // reachability checked inside via ollamaReachable()
  },
  {
    name: 'deepseek',
    label: 'DeepSeek',
    maxRetries: DEEPSEEK_MAX_RETRIES,
    baseMs: DEEPSEEK_BACKOFF_MS,
    maxMs: DEEPSEEK_MAX_BACKOFF_MS,
    enabled: () => !!DEEPSEEK_API_KEY,
  },
];

async function renameOneFile(filename, manifest) {
  if (manifest[filename]) {
    console.log(`⏭️  ${filename} already processed, skipping`);
    return { filename, skipped: true };
  }

  const filePath = path.join(originalImagesFolder, filename);
  const mimeType = lookupMime(filePath);

  for (const stage of MODEL_STAGES) {
    if (!stage.enabled()) {
      console.log(`   ↘️  ${filename}: ${stage.label} skipped (not configured)`);
      continue;
    }
    if (stage.name === 'ollama' && !(await ollamaReachable())) {
      console.log(`   ↘️  ${filename}: Ollama skipped (unreachable)`);
      continue;
    }

    try {
      const parsed = await withRetry(
        `${stage.label} ${filename}`,
        () => classifyWithModel(stage.name, filename, filePath, mimeType),
        { maxRetries: stage.maxRetries, baseMs: stage.baseMs, maxMs: stage.maxMs }
      );
      const result = await finalizeRename(filename, parsed.titleRaw, parsed.altRaw, manifest);
      return { ...result, source: stage.name };
    } catch (err) {
      console.error(
        `❌ ${filename}: ${stage.label} gave up (max retries ${stage.maxRetries}): ` +
          `${sanitizeForLog(err?.message ?? err)}`
      );
      // fall through to the next model
    }
  }

  // Final, never-fail guarantee.
  console.log(`🛟 ${filename}: using filename heuristic (all models exhausted)`);
  const parsed = classifyWithHeuristic(filename);
  const result = await finalizeRename(filename, parsed.titleRaw, parsed.altRaw, manifest);
  return { ...result, source: 'heuristic' };
}

// ---------------------------------------------------------------------------
// Main
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
  console.log(
    `🔁 Per-image retries: Gemini=${GEMINI_MAX_RETRIES}, ` +
      `Ollama=${OLLAMA_MAX_RETRIES}, DeepSeek=${DEEPSEEK_MAX_RETRIES}`
  );
  console.log(`🧵 Concurrency: ${CONCURRENCY}`);
  console.log(`🔁 Cascade order: Google Gemini -> Ollama -> DeepSeek -> heuristic\n`);

  const failures = [];
  const results = await pool(pending, CONCURRENCY, async (filename) => {
    try {
      return await renameOneFile(filename, manifest);
    } catch (err) {
      // Only reachable if finalizeRename itself threw (e.g. disk error) — the
      // heuristic inside renameOneFile already tried its best.
      console.error(`❌ ${filename}: ${sanitizeForLog(err?.message ?? err)}`);
      failures.push(filename);
      return { filename, error: true };
    }
  });

  const sources = {};
  for (const r of results) {
    if (r && r.source) sources[r.source] = (sources[r.source] || 0) + 1;
  }
  console.log(`\n📊 Done. Sources: ${JSON.stringify(sources)}`);

  if (failures.length) {
    console.error(`\n🛑 ${failures.length} certificates could not be processed:`);
    failures.forEach((f) => console.error(`   - ${f}`));
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
  renameOneFile,
  MODEL_STAGES,
};
