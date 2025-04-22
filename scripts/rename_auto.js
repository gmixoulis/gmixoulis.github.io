const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const originalImagesFolder = path.resolve(
  __dirname,
  '../public/img/certificates'
);
const renamedImagesFolder = path.resolve(__dirname, '../public/img/renamed');
const modelName = 'gemini-2.0-flash-lite';

// Ensure renamed folder exists and clean it up
if (!fs.existsSync(renamedImagesFolder)) {
  fs.mkdirSync(renamedImagesFolder, { recursive: true });
} else {
  const files = fs.readdirSync(renamedImagesFolder);
  for (const file of files) {
    const filePath = path.join(renamedImagesFolder, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  }
  console.log('🧹 Cleaned up renamed folder before renaming begins.');
}

// Utility to convert text to Title-Case-Hyphenated format
const formatPart = (str) => {
  return str
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
};

const seenPairs = new Map();
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const renameWithGemini = async (filename) => {
  const filePath = path.join(originalImagesFolder, filename);
  const mimeType = mime.lookup(filePath) || 'image/jpeg';
  const ext = path.extname(filename).toLowerCase();

  try {
    const upload = await ai.files.upload({
      file: filePath,
      config: { mimeType },
    });

    const prompt = `
    You're analyzing an academic or professional certificate.
    
    If the document is an official **degree** (e.g. Bachelor or Master), classify it as:
    - 1Bachelor Degree
    - 1Master Degree
    
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
    
    Be specific. Avoid vague labels like “Copy of Diploma” or “Certificate of Completion” for real degrees.
    If the document is issued by a university, it's likely a degree.
    Use clear English only. Do not include Greek or date ranges.
    `;

    // Retry on rate limit
    let retries = 0;
    let response;
    while (retries < 3) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: createUserContent([
            createPartFromUri(upload.uri, mimeType),
            prompt,
          ]),
        });
        break;
      } catch (err) {
        if (err.message.includes('429')) {
          console.warn(`⏳ Rate limit hit. Waiting 30s...`);
          await delay(30000);
          retries++;
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      console.error(`❌ Failed to process ${filename}`);
      return;
    }

    const text = response.text.trim();
    const lines = text
      .split('\n')
      .map((line) => line.trim())
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

    if (!titleRaw || !altRaw) {
      const fallbackResponse = await ai.models.generateContent({
        model: modelName,
        contents: createUserContent([
          createPartFromUri(upload.uri, mimeType),
          'Provide a clean English label for this certificate (Title Case, max 6 words)',
        ]),
      });
      const fallback = fallbackResponse.text.trim();
      titleRaw = fallback;
      altRaw = fallback;
    }
    const baseName = path.basename(filename, ext).toLowerCase();
    if (baseName.includes('master')) {
      titleRaw = '1Master Degree';
    }
    if (baseName.includes('uom') || baseName.includes('bachelor')) {
      titleRaw = '1Bachelor Degree';
    }

    // New logic: if it's a degree or English cert, include title in alt
    const academicTypes = [
      '1Bachelor Degree',
      '1Master Degree',
      'English Certificate',
      'Certificate of Proficiency in English',
    ];

    if (academicTypes.includes(titleRaw)) {
      altRaw = `${titleRaw} ${altRaw}`;
    }

    // Deduplication logic
    const pairKey = `${titleRaw.toLowerCase()}|${altRaw.toLowerCase()}`;
    if (seenPairs.has(pairKey)) {
      const count = seenPairs.get(pairKey) + 1;
      altRaw += ` ${count}`;
      seenPairs.set(pairKey, count);
    } else {
      seenPairs.set(pairKey, 1);
    }

    const title = formatPart(titleRaw);
    let alt = formatPart(altRaw);
    if (alt.includes('1')) {
      alt = alt.replace(/(\d+)/g, '');
    }
    if (title.includes('Master')) {
      // Fix known bad translations for Data and Web Science
      altRaw = altRaw
        .replace(
          /data[-\s]*science[-\s]*(and)?[-\s]*(the)?[-\s]*(global|world[-\s]*wide)?[-\s]*(web|internet)?/i,
          'Data and Web Science'
        )
        .replace(
          /data[-\s]*science[-\s]*(and)?[-\s]*(web)*science?/i,
          'Data and Web Science'
        )
        .replace(
          /web[-\s]*(and)?[-\s]*data[-\s]*science/i,
          'Data and Web Science'
        )
        .replace(
          /science[-\s]*(and)?[-\s]*(web|internet)/i,
          'Data and Web Science'
        );
    }
    const newFileName = `${title}_${alt}${ext}`;
    const newFilePath = path.join(renamedImagesFolder, newFileName);

    fs.copyFileSync(filePath, newFilePath);
    console.log(`✅ ${filename} → ${newFileName}`);
  } catch (err) {
    console.error(`❌ Error processing ${filename}:`, err.message);
  }
};

const run = async () => {
  const files = fs
    .readdirSync(originalImagesFolder)
    .filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

  for (const file of files) {
    await renameWithGemini(file);
  }

  console.log('🎉 All certificates cleaned, translated, renamed, and sorted.');
};

run();
