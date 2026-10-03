/** Paper importance: citations, kind of venue, first authorship and recency. Used to pick the papers shown first. */
export type RankablePaper = { venue: string; year: string; cites: number; firstAuthor?: boolean };

export function paperScore(p: RankablePaper): number {
  const v = p.venue.toLowerCase(), y = Number(p.year) || 0;
  const venue =
    /journal|transactions|elsevier|practice and theory/.test(v) ? 30 :
    /book chapter/.test(v) ? 18 :
    /conference|symposium|ieee|springer|proceedings/.test(v) ? 20 : 5;
  return p.cites * 3 + venue + (p.firstAuthor ? 10 : 0) + (y >= 2024 ? 8 : y >= 2022 ? 4 : 0);
}

export const rankPapers = <T extends RankablePaper>(ps: T[]) =>
  ps.map((p, i) => ({ p, i, s: paperScore(p) })).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.p);
