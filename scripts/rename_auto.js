require('module').Module._initPaths(); // Adds NODE_PATH automatically
const fs = require('fs');
const path = require('path');
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require('@google/genai');

// ---------------------------------------------------------------------------
// Configuration (all overridable via env in CI)
// ---------------------------------------------------------------------------
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
const MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 6); // per HTTP call
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 90000); // 90s per call
const CONCURRENCY = Number(process.env.GEMINI_CONCURRENCY || 3); // parallel files
const PASSES = Number(process.env.GEMINI_PASSES || 3); // retry failed files in passes
const BASE_BACKOFF_MS = Number(process.env.GEMINI_BACKOFF_MS || 5000);
const MAX_BACKOFF_MS = Number(process.env.GEMINI_MAX_BACKOFF_MS || 120000);

const originalImagesFolder = path.resolve(__dirname, '../public/img/certificates');
const renamedImagesFolder = path.resolve(__dirname, '../public/img/renamed');
const manifestPath = path.resolve(__dirname, '../.cert-manifest.json');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: REQUEST_TIMEOUT_MS },
});

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
// exponential backoff with full jitter, capped at MAX_BACKOFF_MS
const backoffFor = (attempt) =>
  Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempt) +
  Math.floor(Math.random() * 2000);

// MIME lookup without an external dependency (we only handle image types)
const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};
const lookupMime = (filePath) =>
  MIME_BY_EXT[path.extname(filePath).toLowerCase()] || 'image/jpeg';

// Treat anything that is likely to succeed on a retry as transient.
const isTransient = (err) => {
  const msg = String((err && err.message) || err || '');
  const code = Number((err && (err.status || err.code)) || 0);
  return (
    [408, 429, 500, 502, 503, 504].includes(code) ||
    /429|rate.?limit|quota|resource.?exhaust|500|502|503|504|internal|unavailable|deadline|timeout|aborted|econnreset|enotfound|etimedout|socket hang up|fetch failed|network/i.test(
      msg
    )
  );
};

// Retry a single async operation with exponential backoff + jitter.
async function withRetry(label, fn) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (!isTransient(err) || attempt === MAX_RETRIES) throw err;
      const wait = backoffFor(attempt);
      console.warn(
        `  ⚠️  ${label} failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ` +
          `${(err && err.message) || err}. Retrying in ${Math.round(
            wait / 1000
          )}s...`
      );
      await sleep(wait);
    }
  }
  throw lastErr;
}

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
// Per-file processing
// ---------------------------------------------------------------------------
async function classifyImage(filePath, mimeType) {
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
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  let titleRaw = null;
  let altRaw = null;
  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    if (!rest.length) continue;
    const value = rest.join(':').trim();
    if (/certificate type/i.test(key)) titleRaw = value;
    if (/topic/i.test(key)) altRaw = value;
  }

  // Fallback when Gemini didn't follow the requested format.
  if (!titleRaw || !altRaw) {
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
    titleRaw = titleRaw || fallback;
    altRaw = altRaw || fallback;
  }

  return { titleRaw, altRaw };
}

async function renameWithGemini(filename, manifest) {
  const filePath = path.join(originalImagesFolder, filename);
  const mimeType = lookupMime(filePath);
  const ext = path.extname(filename).toLowerCase();

  // Resumability: skip files we already successfully renamed in a prior run.
  if (manifest[filename]) {
    console.log(`⏭️  ${filename} already processed, skipping`);
    return { filename, skipped: true };
  }

  const { titleRaw, altRaw: altInitial } = await classifyImage(
    filePath,
    mimeType
  );

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
// Main: multiple passes until everything succeeds (or passes are exhausted)
// ---------------------------------------------------------------------------
const seenPairs = new Map();

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

  let pass = 0;
  let failures = [];
  while (pending.length && pass < PASSES) {
    pass++;
    console.log(`\n=== Pass ${pass}/${PASSES}: ${pending.length} files ===`);
    failures = [];
    const results = await pool(pending, CONCURRENCY, async (filename) => {
      try {
        return await renameWithGemini(filename, manifest);
      } catch (err) {
        console.error(`❌ ${filename}: ${(err && err.message) || err}`);
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

  if (pending.length) {
    console.error(
      `\n🛑 ${pending.length} certificates could not be processed after ${PASSES} passes:`
    );
    pending.forEach((f) => console.error(`   - ${f}`));
    process.exit(1);
  }
  console.log('\n🎉 All certificates cleaned, translated, renamed, and sorted.');
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
