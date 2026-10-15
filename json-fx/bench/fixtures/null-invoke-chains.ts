import type { BenchFixture } from "./types";

/** V1-PLAN.md B1: v0 evaluates the receiver of each `?:` twice, so n chained `?:` cost 2^n. */
const chain = (base: string, n: number): string =>
  base + Array.from({ length: n }, (_, i) => (i % 2 ? "?:toLowerCase" : "?:toUpperCase")).join("");

export const nullInvokeChains: BenchFixture = {
  name: "null-invoke-chains",
  description: "chains of 2, 4, 6 and 8 `?:` steps (v0 re-evaluates the receiver at every level, B1)",
  template: {
    "n2": chain("$.s", 2),
    "n4": chain("$.s", 4),
    "n6": chain("$.s", 6),
    "n8": chain("$.s", 8)
  },
  makeInput: (k) => ({ s: k % 5 ? "Value" + k : null }),
  handWritten: (d) => {
    const run = (n: number): string | null =>
      d.s == null ? null : n % 2 ? String(d.s).toUpperCase() : String(d.s).toLowerCase();
    // an even number of alternating steps ends in toLowerCase, an odd one in toUpperCase
    return { n2: run(2), n4: run(4), n6: run(6), n8: run(8) };
  }
};
