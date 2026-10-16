/** Small seeded PRNG (mulberry32) so fuzz and differential failures are reproducible from a seed. */
export class Random {
  private state: number;

  constructor(public readonly seed: number) {
    this.state = seed >>> 0;
  }

  /** Uniform in [0, 1). */
  public next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Integer in [lo, hi]. */
  public int(lo: number, hi: number): number {
    return lo + Math.floor(this.next() * (hi - lo + 1));
  }

  public chance(p: number): boolean {
    return this.next() < p;
  }

  public pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)] as T;
  }

  /** Picks by weight: `[[weight, value], …]`. */
  public weighted<T>(items: ReadonlyArray<readonly [number, T]>): T {
    const total = items.reduce((n, [w]) => n + w, 0);
    let r = this.next() * total;
    for (const [w, v] of items) {
      r -= w;
      if (r < 0) { return v; }
    }
    return items[items.length - 1]![1];
  }
}

/** Fragments that have broken JS source generators before: quoting, comments, template literals, line terminators, prototype keys. */
export const HOSTILE_FRAGMENTS: readonly string[] = [
  "'", "\"", "\\", "`", "${", "${1}", "*/", "/*", "//", "</script>", "<!--", "-->", "\u2028", "\u2029", "\n", "\r", "\0", "\t",
  "__proto__", "constructor", "prototype", "toString", "hasOwnProperty", "\ud800", "\udc00", "😀", "é", "\\u0041",
  "\\n", "\\'", "'+", "+'", "'));", "});", "}", "{", "]", "[", ")", "(", ";", ",", "=>", "?.", "a", "b", "0", "1", " ", "$", "@", ":"
];

export function hostileString(rand: Random, maxParts = 6): string {
  const parts = rand.int(0, maxParts);
  let s = "";
  for (let i = 0; i < parts; i++) { s += rand.pick(HOSTILE_FRAGMENTS); }
  return s;
}
