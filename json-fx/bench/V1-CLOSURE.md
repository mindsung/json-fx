# v1 closure backend benchmark

Recorded 2026-10-15 (Phase 3) with `npm run bench -- --markdown`, same machine and method as [BASELINE.md](BASELINE.md)
(output checked against the hand-written reference on all 1000 inputs, 300 ms warm-up, three 400 ms rounds).
`v1-closure` is `new JsonFx({ backend: 'closure' }).compile(t).run({ $: input })`.

Plan targets (V1-PLAN.md §8, Phase 4 exit): closure backend ≥ 5× faster than v0 "adjust once measured"; codegen ≤ 0.5 µs on the
`order` fixture. Measured for the closure backend: ~7× on `order`, ~5× on `nested-lambdas`, 2× on `flat-projection`,
1.3–1.4× on `string-heavy` and `deep-chains` (little work per evaluation, so v0's overhead matters less), ~2.7× on `recursion`
(where v0 also returns wrong values, so it does less work). The ≥ 5× target holds for the lambda/object-heavy templates;
the code generator (Phase 4) is what closes the remaining gap to hand-written code.

Node v22.22.3, darwin arm64, Apple M2 Max

| Fixture | Engine | µs / evaluation (median of 3) | best | compile µs | note |
|---|---|---|---|---|---|
| order | v0 | 34.08 | 34.05 | 3588 |  |
| order | v1-closure | 4.79 | 4.79 | 2942 |  |
| order | hand-written | 0.14 | 0.14 | 0 |  |
| flat-projection | v0 | 1.35 | 1.35 | 707 |  |
| flat-projection | v1-closure | 0.63 | 0.63 | 564 |  |
| flat-projection | hand-written | 0.03 | 0.03 | 0 |  |
| string-heavy | v0 | 5.12 | 5.10 | 724 |  |
| string-heavy | v1-closure | 3.61 | 3.58 | 557 |  |
| string-heavy | hand-written | 2.79 | 2.78 | 0 |  |
| nested-lambdas | v0 | 52.90 | 52.76 | 684 |  |
| nested-lambdas | v1-closure | 10.04 | 10.00 | 368 |  |
| nested-lambdas | hand-written | 0.41 | 0.41 | 0 |  |
| deep-chains | v0 | 0.88 | 0.88 | 760 |  |
| deep-chains | v1-closure | 0.64 | 0.64 | 369 |  |
| deep-chains | hand-written | 0.03 | 0.03 | 0 |  |
| recursion | v0 | 10.44 | 10.41 | 702 | output differs from reference (B2: user functions are not re-entrant in v0, so recursion returns wrong values) |
| recursion | v1-closure | 3.82 | 3.80 | 561 |  |
| recursion | hand-written | 0.46 | 0.46 | 0 |  |
