# v1 code generator benchmark

Recorded 2026-10-15 (Phase 4) with `npm run bench -- --markdown`, same machine and method as [BASELINE.md](BASELINE.md) and
[V1-CLOSURE.md](V1-CLOSURE.md) (output checked against the hand-written reference on all 1000 inputs, 300 ms warm-up, three 400 ms
rounds). `v1-codegen` is `new JsonFx({ backend: 'codegen' }).compile(t).run({ $: input })`.

Phase 4 exit targets (V1-PLAN.md §8): codegen ≤ 0.5 µs per evaluation on the `order` fixture: **met, 0.29 µs** (hand-written 0.14 µs, v0 34 µs,
closure 5.4 µs). The closure backend is ≥ 5× faster than v0 on the lambda- and object-heavy fixtures (see V1-CLOSURE.md); on the others there
is little work per evaluation for v0 to waste, and the code generator is what reaches hand-written speed: 0.04 µs on `flat-projection` and
`deep-chains` (hand-written 0.03/0.04), 0.9 µs on `nested-lambdas` (0.41) and `recursion` (0.46), and ~equal to hand-written on `string-heavy`,
which is dominated by the string functions themselves.

Compile time is of the same order as v0 (0.3–2.3 ms) because `new Function` is cheap next to parsing and resolving.

Node v22.22.3, darwin arm64, Apple M2 Max

| Fixture | Engine | µs / evaluation (median of 3) | best | compile µs | note |
|---|---|---|---|---|---|
| order | v0 | 34.49 | 34.25 | 3197 |  |
| order | v1-closure | 5.43 | 5.41 | 3100 |  |
| order | v1-codegen | 0.29 | 0.29 | 2732 |  |
| order | hand-written | 0.14 | 0.14 | 0 |  |
| flat-projection | v0 | 1.34 | 1.33 | 716 |  |
| flat-projection | v1-closure | 0.65 | 0.64 | 412 |  |
| flat-projection | v1-codegen | 0.04 | 0.04 | 638 |  |
| flat-projection | hand-written | 0.03 | 0.03 | 0 |  |
| string-heavy | v0 | 7.75 | 5.08 | 604 |  |
| string-heavy | v1-closure | 3.62 | 3.61 | 358 |  |
| string-heavy | v1-codegen | 2.88 | 2.85 | 352 |  |
| string-heavy | hand-written | 2.82 | 2.82 | 0 |  |
| nested-lambdas | v0 | 57.98 | 57.94 | 842 |  |
| nested-lambdas | v1-closure | 10.51 | 10.41 | 303 |  |
| nested-lambdas | v1-codegen | 0.95 | 0.94 | 530 |  |
| nested-lambdas | hand-written | 0.42 | 0.42 | 0 |  |
| deep-chains | v0 | 0.88 | 0.88 | 840 |  |
| deep-chains | v1-closure | 0.67 | 0.67 | 414 |  |
| deep-chains | v1-codegen | 0.04 | 0.04 | 497 |  |
| deep-chains | hand-written | 0.03 | 0.03 | 0 |  |
| null-invoke-chains | v0 | 79.16 | 78.97 | 881 |  |
| null-invoke-chains | v1-closure | 0.60 | 0.60 | 410 |  |
| null-invoke-chains | v1-codegen | 0.22 | 0.21 | 518 |  |
| null-invoke-chains | hand-written | 0.25 | 0.24 | 0 |  |
| recursion | v0 | 10.95 | 10.85 | 693 | output differs from reference (B2: user functions are not re-entrant in v0, so recursion returns wrong values) |
| recursion | v1-closure | 6.82 | 6.79 | 530 |  |
| recursion | v1-codegen | 0.84 | 0.83 | 435 |  |
| recursion | hand-written | 0.47 | 0.47 | 0 |  |
