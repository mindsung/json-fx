# v1 closure backend benchmark

Recorded 2026-10-15 (Phase 3) with `npm run bench -- --markdown`, same machine and method as [BASELINE.md](BASELINE.md)
(output checked against the hand-written reference on all 1000 inputs, 300 ms warm-up, three 400 ms rounds).
`v1-closure` is `new JsonFx({ backend: 'closure' }).compile(t).run({ $: input })`.

Plan targets (V1-PLAN.md §8, Phase 4 exit): closure backend ≥ 5× faster than v0 "adjust once measured"; codegen ≤ 0.5 µs on the
`order` fixture. Measured for the closure backend (rerun 2026-10-15 with the `null-invoke-chains` fixture added): ~7× on `order`, ~5× on `nested-lambdas`, 2× on `flat-projection`,
1.3–1.4× on `string-heavy` and `deep-chains` (little work per evaluation, so v0's overhead matters less), ~2.7× on `recursion`
(where v0 also returns wrong values, so it does less work). The ≥ 5× target holds for the lambda/object-heavy templates;
the code generator (Phase 4) is what closes the remaining gap to hand-written code.

`null-invoke-chains` (added after the first recording) exercises B1: keys with 2, 4, 6 and 8 chained `?:` steps, which v0
evaluates in 2^n receiver evaluations. v0 takes 48–79 µs per evaluation (run-to-run noise is large because the cost is
dominated by the exponential part), v1 about 0.6 µs, i.e. ~80–135× faster. The other fixtures chain at most one `?:`, so
they barely show B1; this one is the honest measure for templates that chain several.

Node v22.22.3, darwin arm64, Apple M2 Max

| Fixture | Engine | µs / evaluation (median of 3) | best | compile µs | note |
|---|---|---|---|---|---|
| order | v0 | 34.45 | 34.31 | 3513 |  |
| order | v1-closure | 4.87 | 4.84 | 2973 |  |
| order | hand-written | 0.14 | 0.14 | 0 |  |
| flat-projection | v0 | 1.33 | 1.32 | 755 |  |
| flat-projection | v1-closure | 0.64 | 0.64 | 583 |  |
| flat-projection | hand-written | 0.03 | 0.03 | 0 |  |
| string-heavy | v0 | 4.98 | 4.95 | 643 |  |
| string-heavy | v1-closure | 3.58 | 3.54 | 549 |  |
| string-heavy | hand-written | 2.79 | 2.77 | 0 |  |
| nested-lambdas | v0 | 51.92 | 51.65 | 815 |  |
| nested-lambdas | v1-closure | 10.09 | 10.04 | 348 |  |
| nested-lambdas | hand-written | 0.41 | 0.40 | 0 |  |
| deep-chains | v0 | 0.87 | 0.87 | 749 |  |
| deep-chains | v1-closure | 0.65 | 0.65 | 369 |  |
| deep-chains | hand-written | 0.03 | 0.03 | 0 |  |
| null-invoke-chains | v0 | 78.67 | 78.47 | 848 |  |
| null-invoke-chains | v1-closure | 0.58 | 0.57 | 404 |  |
| null-invoke-chains | hand-written | 0.25 | 0.24 | 0 |  |
| recursion | v0 | 10.65 | 10.54 | 674 | output differs from reference (B2: user functions are not re-entrant in v0, so recursion returns wrong values) |
| recursion | v1-closure | 3.82 | 3.78 | 530 |  |
| recursion | hand-written | 0.47 | 0.47 | 0 |  |
