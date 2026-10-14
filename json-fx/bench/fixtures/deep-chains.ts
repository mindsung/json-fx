import type { BenchFixture } from "./types";

export const deepChains: BenchFixture = {
  name: "deep-chains",
  description: "deep property chains and ?. / ?: null-conditionals over partly-null data",
  template: {
    "a": "$.a?.b?.c?.d",
    "b": "$.x?.y?:toString",
    "c": "$.p.q.r.s.t",
    "d": "$.m?.n?.o?:toUpperCase",
    "e": "$.a?.b?.c?.d?.e"
  },
  makeInput: (k) => ({
    a: k % 3 ? { b: { c: { d: k, e: null } } } : { b: null },
    x: k % 4 ? { y: k } : null,
    p: { q: { r: { s: { t: "deep" + k } } } },
    m: k % 2 ? { n: { o: "val" + k } } : { n: null }
  }),
  handWritten: (d) => {
    const bc = d.a?.b?.c;
    return {
      a: bc?.d ?? null,
      b: d.x == null ? null : d.x.y == null ? null : String(d.x.y),
      c: d.p.q.r.s.t,
      d: d.m?.n?.o == null ? null : String(d.m.n.o).toUpperCase(),
      e: bc?.d == null ? null : bc.d.e
    };
  }
};
