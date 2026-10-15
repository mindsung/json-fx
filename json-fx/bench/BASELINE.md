# v0 benchmark baseline

Recorded 2026-10-14 against the published `@mindsung/json-fx@0.1.25` (alias `json-fx-v0`) with `npm run bench -- --markdown`.
Each engine's output is first checked against the hand-written reference on all 1000 inputs; then timed with a 300 ms
warm-up and three 400 ms rounds cycling over those inputs. The `recursion` row is timed even though v0's output is wrong (B2).
"compile µs" is informational only (parse/compile speed is not a v1 goal); the first row includes cold-start JIT cost.

The Appendix C `order` fixture matches the figure measured when the plan was written (v0 ≈ 35 µs/eval, hand-written ≈ 0.2 µs).
The `null-invoke-chains` fixture (B1) was added on 2026-10-15 and has no row here; v0 measured 48–79 µs on it (see V1-CLOSURE.md).
Re-record this file on the same machine before comparing v1 numbers against it.

Node v22.22.3, darwin arm64, Apple M2 Max

| Fixture | Engine | µs / evaluation (median of 3) | best | compile µs | note |
|---|---|---|---|---|---|
| order | v0 | 33.63 | 33.62 | 3106 |  |
| order | hand-written | 0.13 | 0.13 | 0 |  |
| flat-projection | v0 | 1.32 | 1.32 | 737 |  |
| flat-projection | hand-written | 0.03 | 0.03 | 0 |  |
| string-heavy | v0 | 4.91 | 4.91 | 591 |  |
| string-heavy | hand-written | 2.78 | 2.77 | 0 |  |
| nested-lambdas | v0 | 51.12 | 50.75 | 684 |  |
| nested-lambdas | hand-written | 0.40 | 0.40 | 0 |  |
| deep-chains | v0 | 0.85 | 0.85 | 775 |  |
| deep-chains | hand-written | 0.02 | 0.02 | 0 |  |
| recursion | v0 | 10.27 | 10.23 | 396 | output differs from reference (B2: user functions are not re-entrant in v0, so recursion returns wrong values) |
| recursion | hand-written | 0.46 | 0.46 | 0 |  |
