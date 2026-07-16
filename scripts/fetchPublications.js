const fs = require('fs');
const axios = require('axios');

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

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const backoffFor = (attempt) =>
  Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempt) +
  Math.floor(Math.random() * 2000);

const isTransient = (err) => {
  const status = err && err.response && err.response.status;
  const msg = String((err && err.message) || err || '');
  return (
    [408, 429, 500, 502, 503, 504].includes(status) ||
    /timeout|econnreset|enotfound|etimedout|socket hang up|network|429|rate.?limit/i.test(
      msg
    )
  );
};

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
        `⚠️  ${label} failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ` +
          `${(err && err.message) || err}. Retrying in ${Math.round(
            wait / 1000
          )}s...`
      );
      await sleep(wait);
    }
  }
  throw lastErr;
}

const fetchPublications = async () => {
  if (!API_KEY) {
    console.error('❌ SERPAPI_KEY is not set');
    process.exit(2);
  }

  const url = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${SCHOLAR_ID}&api_key=${API_KEY}&no_cache=true`;

  try {
    const response = await withRetry('fetch publications', () =>
      axios.get(url, { timeout: REQUEST_TIMEOUT_MS })
    );
    const articles = response.data.articles || [];
    fs.writeFileSync(OUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`✅ Publications saved via SerpAPI (${articles.length} articles)`);
  } catch (err) {
    const status = err && err.response && err.response.status;
    console.error(
      `❌ Failed to fetch publications after ${MAX_RETRIES + 1} attempts ` +
        `(status: ${status || 'n/a'}): ${(err && err.message) || err}`
    );
    process.exit(1);
  }
};

fetchPublications();
