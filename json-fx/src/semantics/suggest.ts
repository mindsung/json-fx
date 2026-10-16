function distance(a: string, b: string): number {
  if (a === b) { return 0; }
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min((row[j - 1] as number) + 1, (prev[j] as number) + 1, (prev[j - 1] as number) + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length] as number;
}

/** Up to `max` candidates close to `name` (case-insensitive edit distance), best first. */
export function suggest(name: string, candidates: Iterable<string>, max = 3): string[] {
  const lower = name.toLowerCase();
  const limit = Math.max(2, Math.floor(name.length / 3));
  const scored: Array<{ candidate: string; score: number }> = [];
  for (const candidate of candidates) {
    const score = distance(lower, candidate.toLowerCase());
    if (score <= limit) { scored.push({ candidate, score }); }
  }
  scored.sort((x, y) => x.score - y.score || x.candidate.localeCompare(y.candidate));
  return scored.slice(0, max).map(s => s.candidate);
}

/** ` Did you mean 'a', 'b'?` or an empty string. */
export function didYouMean(name: string, candidates: Iterable<string>): string {
  const found = suggest(name, candidates);
  return found.length ? ` Did you mean ${found.map(f => `'${f}'`).join(", ")}?` : "";
}
