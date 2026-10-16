# v1 optimizer benchmark

Recorded 2026-10-15 (Phase 5) with `npm run bench -- --markdown`, same machine and method as [V1-CODEGEN.md](V1-CODEGEN.md).
`v1-codegen-noopt` is `new JsonFx({ backend: 'codegen', optimize: false })`; `v1-codegen` has the optimizer on (the default).

**Result: the optimizer is within noise (1.0–1.1×) on every fixture.** That is expected. The fixtures are written the way real templates
are (computation over the input), so they contain little that is input-independent, and the code generator was already within 2× of
hand-written code. What the optimizer buys is on templates with constants: a literal `$var` stops being a memoizing thunk, `1 + 2 * 3`,
`'ab':toUpperCase()` and `math~round(2.567 * 100) / 100` become literals, `$a if $flag else $b` with a literal `$flag` loses a branch, and
unused declarations disappear. It also shrinks the generated source, which is why compile time is a little lower. The optimizer's
real gate is correctness: `DIFF_CASES=100000 npx vitest run test/differential.test.ts` compares every combination of backend and
optimizer on 100,000 random templates (275,001 runs), and 92% of those templates are changed by the optimizer.

Node v22.22.3, darwin arm64, Apple M2 Max

| Fixture | Engine | µs / evaluation (median of 3) | best | compile µs | note |
|---|---|---|---|---|---|
| order | v0 | 34.34 | 34.30 | 2984 |  |
| order | v1-closure | 5.24 | 5.22 | 3711 |  |
| order | v1-codegen-noopt | 0.29 | 0.29 | 2271 |  |
| order | v1-codegen | 0.27 | 0.27 | 834 |  |
| order | hand-written | 0.14 | 0.14 | 0 |  |
| flat-projection | v0 | 1.33 | 1.33 | 758 |  |
| flat-projection | v1-closure | 0.65 | 0.65 | 269 |  |
| flat-projection | v1-codegen-noopt | 0.04 | 0.04 | 372 |  |
| flat-projection | v1-codegen | 0.04 | 0.04 | 230 |  |
| flat-projection | hand-written | 0.03 | 0.03 | 0 |  |
| string-heavy | v0 | 4.93 | 4.91 | 588 |  |
| string-heavy | v1-closure | 3.62 | 3.60 | 391 |  |
| string-heavy | v1-codegen-noopt | 2.88 | 2.88 | 342 |  |
| string-heavy | v1-codegen | 2.79 | 2.79 | 385 |  |
| string-heavy | hand-written | 2.83 | 2.76 | 0 |  |
| nested-lambdas | v0 | 52.29 | 52.08 | 863 |  |
| nested-lambdas | v1-closure | 10.31 | 10.26 | 347 |  |
| nested-lambdas | v1-codegen-noopt | 0.93 | 0.93 | 531 |  |
| nested-lambdas | v1-codegen | 0.93 | 0.92 | 295 |  |
| nested-lambdas | hand-written | 0.41 | 0.41 | 0 |  |
| deep-chains | v0 | 0.88 | 0.87 | 789 |  |
| deep-chains | v1-closure | 0.67 | 0.67 | 269 |  |
| deep-chains | v1-codegen-noopt | 0.03 | 0.03 | 519 |  |
| deep-chains | v1-codegen | 0.04 | 0.03 | 249 |  |
| deep-chains | hand-written | 0.03 | 0.03 | 0 |  |
| null-invoke-chains | v0 | 79.43 | 78.90 | 775 |  |
| null-invoke-chains | v1-closure | 0.60 | 0.60 | 261 |  |
| null-invoke-chains | v1-codegen-noopt | 0.17 | 0.17 | 350 |  |
| null-invoke-chains | v1-codegen | 0.17 | 0.17 | 246 |  |
| null-invoke-chains | hand-written | 0.25 | 0.25 | 0 |  |
| recursion | v0 | 10.46 | 10.44 | 771 | output differs from reference (B2: user functions are not re-entrant in v0, so recursion returns wrong values) |
| recursion | v1-closure | 6.76 | 6.75 | 427 |  |
| recursion | v1-codegen-noopt | 0.83 | 0.83 | 400 |  |
| recursion | v1-codegen | 0.83 | 0.83 | 186 |  |
| recursion | hand-written | 0.47 | 0.47 | 0 |  |

## Speedup over v0

v0 µs ÷ engine µs (higher is faster); the last two columns compare the optimizer and the code generator with each other.

| Fixture | v0 µs | closure µs | codegen (no optimizer) µs | codegen µs | hand-written µs | closure vs v0 | codegen vs v0 | codegen vs closure | optimizer gain |
|---|---|---|---|---|---|---|---|---|---|
| order | 34.34 | 5.24 | 0.29 | 0.27 | 0.14 | 6.6× | 126.8× | 19.3× | 1.1× |
| flat-projection | 1.33 | 0.65 | 0.04 | 0.04 | 0.03 | 2.0× | 35.1× | 17.2× | 1.0× |
| string-heavy | 4.93 | 3.62 | 2.88 | 2.79 | 2.83 | 1.4× | 1.8× | 1.3× | 1.0× |
| nested-lambdas | 52.29 | 10.31 | 0.93 | 0.93 | 0.41 | 5.1× | 56.4× | 11.1× | 1.0× |
| deep-chains | 0.88 | 0.67 | 0.03 | 0.04 | 0.03 | 1.3× | 24.9× | 19.1× | 1.0× |
| null-invoke-chains | 79.43 | 0.60 | 0.17 | 0.17 | 0.25 | 132.7× | 461.9× | 3.5× | 1.0× |
| recursion | 10.46 | 6.76 | 0.83 | 0.83 | 0.47 | 1.5× | 12.7× | 8.2× | 1.0× |
