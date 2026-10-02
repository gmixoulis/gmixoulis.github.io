/**
 * Certificate importance, so the page can always show the most valuable ones without hand-picking.
 * Works on what the rename workflow already produces: "<Kind>_<Title>.<ext>" plus the optional label in profile.ts.
 * Score = kind of document + who issued it + how big it was. Degrees are pinned above everything.
 */
export type Rankable = { file: string; title: string; by: string };

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
  return s;
}

/** Degrees first, then by score (stable for ties). */
export const rankCerts = <T extends Rankable>(cs: T[]) =>
  cs.map((c, i) => ({ c, i, s: certScore(c) })).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.c);
