'use strict';

// Shared retry/backoff helpers used by the CI scripts (rename_auto.js,
// fetchPublications.js). Centralizing them avoids duplicated logic and
// keeps the jitter RNG cryptographically unbiased.

const crypto = require('node:crypto');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Exponential backoff with full jitter, capped at maxMs. Uses crypto for
// unbiased jitter (Math.random is not security-safe).
const backoffFor = (attempt, baseMs, maxMs) =>
  Math.min(maxMs, baseMs * 2 ** attempt) + crypto.randomInt(0, 2000);

// Strip control characters / newlines / ANSI escapes so error messages
// cannot inject forged lines into CI logs (log injection).
const sanitizeForLog = (value) =>
  String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')
    .slice(0, 500);

const TRANSIENT_CODES = new Set([408, 429, 500, 502, 503, 504]);
const TRANSIENT_RE =
  /timeout|econnreset|enotfound|etimedout|socket hang up|fetch failed|network|429|rate.?limit|quota|resource.?exhaust|unavailable|deadline|aborted/i;

// Treat anything likely to succeed on a retry as transient.
const isTransient = (err) => {
  if (!err) return false;
  const status = err.response?.status ?? err.status ?? err.code;
  if (TRANSIENT_CODES.has(Number(status))) return true;
  return TRANSIENT_RE.test(String(err.message ?? err));
};

// Retry a single async operation with exponential backoff + jitter.
async function withRetry(label, fn, opts = {}) {
  const {
    maxRetries = 6,
    baseMs = 5000,
    maxMs = 120000,
    isTransientCheck = isTransient,
  } = opts;
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (!isTransientCheck(err) || attempt === maxRetries) throw err;
      const wait = backoffFor(attempt, baseMs, maxMs);
      console.warn(
        `  ⚠️  ${sanitizeForLog(label)} failed (attempt ${attempt + 1}/${maxRetries + 1}): ` +
          `${sanitizeForLog(err?.message ?? err)}. Retrying in ${Math.round(wait / 1000)}s...`
      );
      await sleep(wait);
    }
  }
  throw lastErr;
}

module.exports = { sleep, backoffFor, isTransient, withRetry, sanitizeForLog };
