const fs = require('node:fs');
const axios = require('axios');
const { withRetry, sanitizeForLog } = require('./lib/retry');

// ---------------------------------------------------------------------------
// Configuration (overridable via env in CI)
// ---------------------------------------------------------------------------
const API_KEY = process.env.SERPAPI_KEY;
const SCHOLAR_ID = process.env.SCHOLAR_ID || 'nk0lq8YAAAAJ';
const OUT_FILE = process.env.PUBLICATIONS_OUT || 'public/publications.json';
const MAX_RETRIES = Number(process.env.SERPAPI_MAX_RETRIES || 6);
const REQUEST_TIMEOUT_MS = Number(process.env.SERPAPI_TIMEOUT_MS || 60000);
const BASE_BACKOFF_MS = Number(process.env.SERPAPI_BACKOFF_MS || 5000);
const MAX_BACKOFF_MS = Number(process.env.SERPAPI_MAX_BACKOFF_MS || 120000);

const fetchPublications = async () => {
  if (!API_KEY) {
    console.error('❌ SERPAPI_KEY is not set');
    process.exit(2);
  }

  const url = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${SCHOLAR_ID}&api_key=${API_KEY}&no_cache=true`;

  try {
    const response = await withRetry(
      'fetch publications',
      () => axios.get(url, { timeout: REQUEST_TIMEOUT_MS }),
      { maxRetries: MAX_RETRIES, baseMs: BASE_BACKOFF_MS, maxMs: MAX_BACKOFF_MS }
    );
    const articles = response.data?.articles || [];
    fs.writeFileSync(OUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`✅ Publications saved via SerpAPI (${articles.length} articles)`);
  } catch (err) {
    const status = err?.response?.status;
    console.error(
      `❌ Failed to fetch publications after ${MAX_RETRIES + 1} attempts ` +
        `(status: ${status || 'n/a'}): ${sanitizeForLog(err?.message ?? err)}`
    );
    process.exit(1);
  }
};

fetchPublications();
