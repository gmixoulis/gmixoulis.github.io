/**
 * Certificate importance, so the page can always show the most valuable ones without hand-picking.
 * Works on what the rename workflow already produces: "<Kind>_<Title>.<ext>" plus the optional label in profile.ts.
 * Score = kind of document + who issued it + how big it was. Degrees are pinned above everything.
 */
export type Rankable = { file: string; title: string; by: string; pin?: boolean };

/** Big-name issuers: an attendance certificate from one of these can still reach the top. Matched as whole words. */
const TOP = ['harvard', 'mit', 'stanford', 'oxford', 'cambridge', 'princeton', 'yale', 'berkeley', 'eth zurich',
  'cisco', 'ieee', 'microsoft', 'azure', 'aws', 'amazon web services', 'ibm', 'linux foundation', 'deepmind'];
const UNI = /\b(university|universit|institute|school|college|academy|auth)\b|πανεπιστ/;

export const isDegree = (c: Rankable) => /degree/i.test(c.file.split('_')[0]);

export function certScore(c: Rankable): number {
  const kind = c.file.split('_')[0].toLowerCase();
  const text = `${c.title} ${c.by} ${c.file.replace(/[-_]/g, ' ')}`.toLowerCase();
  if (isDegree(c)) return 1000;
  let s =
    /award/.test(kind) ? 65 :
    /internship/.test(text) ? 45 :
    /english|proficiency|language/.test(kind) ? 50 :
    /completion|achievement|accomplishment|certified/.test(kind) ? 35 :
    /participation/.test(kind) ? 10 :
    /attendance/.test(kind) ? 6 : 20;
  if (TOP.some((t) => new RegExp(`\\b${t}\\b`).test(text))) s += 30;
  else if (UNI.test(text)) s += 10;
  const hours = Number(text.match(/(\d+)\s*hours?\b/)?.[1] ?? 0);
  const ects = Number(text.match(/(\d+(?:\.\d+)?)\s*ects\b/)?.[1] ?? 0);
  s += Math.min(30, hours / 4) + Math.min(30, ects * 6);
  if (/\b(program|programme|bootcamp|series|course|academy)\b/.test(text)) s += 8;
  if (/\b(webinar|workshop|event|day)\b|hour of code/.test(text)) s -= 6;
  const year = Number(text.match(/\b(19|20)\d{2}\b/)?.[0] ?? 0);
  if (year >= 2020) s += 3;
  if (year && year < 2016) s -= 20; // school-era
  // relevance to a software engineer's work
  if (/linux|machine learning|neural|cloud|azure|security|hacking|cyber|blockchain|network|rust|software|developer|programming|smart contract|\bsui\b|\bmove\b|data/.test(text)) s += 15;
  else if (/marketing|brand|tourism|customer/.test(text)) s -= 10;
  return s;
}

/** Show the degrees, every pinned certificate, then the best-scoring ones up to `n` non-degrees. */
export function pickFeatured<T extends Rankable>(ranked: T[], n = 6): Set<T> {
  const out = new Set(ranked.filter((c) => isDegree(c) || c.pin));
  for (const c of ranked) { if ([...out].filter((x) => !isDegree(x)).length >= n) break; out.add(c); }
  return out;
}

/** Degrees first, then by score (stable for ties). */
export const rankCerts = <T extends Rankable>(cs: T[]) =>
  cs.map((c, i) => ({ c, i, s: certScore(c) })).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.c);
