# JSON-fx v1 — Progress & Handoff

Living handoff doc for the v1 implementation. The design lives in [`V1-PLAN.md`](V1-PLAN.md); this file records **decisions made while implementing, deviations from the plan, and where we are**. A fresh session should read this first, then the plan sections it points to.

- **Branch:** `feature/v1-code-gen` (docs-only commits may go straight to `develop`; implementation stays on the feature branch until stable).
- **Tag:** `v0-final` = `develop` @ `28bc28b` (pushed to origin).

---

## Decisions

### From the plan (owner, 2026-10-14) — see V1-PLAN.md header
- Parentheses end a `?` chain (Class C).
- Optional keys `"name?"` implemented (Class C).
- Bare words in value position stay string constants; unknown names in *call* position are compile errors.
- Own function properties of inputs stay callable; inherited functions blocked.
- Missing input throws lazily at run time.
- Trust model: authors trusted in our projects; published library hardens by default, is not a sandbox.

### Resolved §10 open questions (owner, 2026-10-14)
| Q | Decision |
|---|---|
| 5 | Keep lambda-arg normalization (`undefined` → `null`). |
| 6 | Closure backend is production-quality (and the semantic reference). |
| 7 | Dynamic keys over objects: `$v` = value, `$k` = key. |
| 9 | No async extension functions assumed. (If this changes, revisit in Phase 2 — it affects IR/API.) |
| 10 | String escapes: only `\'` and `\\`; other backslashes literal. |
| 8 | **Still open (non-blocking until Phase 6):** owner to supply sanitized real templates + sample inputs for the conformance corpus / release gate. |

### Implementation decisions (2026-10-14)
- **Layout:** v0 stays in `json-fx/src/` untouched until Phase 6. v1 is built in a new directory alongside it (`json-fx/src-v1/`, with `test/` and `bench/` for v1); at the end v0 is deleted and v1 is `git mv`'d into `src/`.
- **Toolchain:** add TS 5 + vitest for v1 code; **do not** touch v0's mocha/ts-node/tslint setup, so the v0 baseline (73 passing / 23 failing, see plan §0) stays reproducible while the corpus is ported. Full toolchain cut-over (drop tslint/polyfills/`lib: dom`, collapse `npm/package.json`, fix `exports`) happens when v0 is removed.
- **Tag:** `v0-final` created and pushed.

---

## Phasing / session plan

Each session ends green and committed. Phase numbers refer to V1-PLAN.md §8.

| Session | Scope | Status |
|---|---|---|
| 1 | **Phase 0** — groundwork: toolchain for v1, conformance runner (runs against v0), seed corpus, bench harness + v0 baseline, v0 npm alias + `compare` stub | **done** (2026-10-14) |
| 2 | **Phase 2** — errors, types, AST, scanner, Pratt parser, template reader, stdlib port (with `pure` metadata; fix B13, remove `funny`) | not started |
| 3 | **Phase 3** — resolver, closure backend, runtime helpers (security rules), public API (`run`/`evaluate`/`defineGlobal`), security tests | not started |
| 4 | **Phase 4** — `emit.ts` + fuzz tests, JS codegen, `backend: 'auto'`, differential test | not started |
| 5 | **Phase 5** (optimizer/inlining) + start of **Phase 6** (`json-fx check` CLI) | not started |
| 6 | **Phase 6** rest — README + Security section, migration guide, crypto smoke test, `compare` release gate over real templates, release 1.0.0 | not started |

Phase 1 (v0.2 hotfix) is skipped per the plan (trusted authors).

---

## Status log

### Session 1 — Phase 0 (done)
- [x] `v0-final` tag created and pushed
- [x] Branch `feature/v1-code-gen` created
- [x] `V1-PROGRESS.md` started
- [x] v1 toolchain in `json-fx/`: vitest 3, TS 5.9 (as `typescript5`, see Deviations), tsx, `tsconfig.v1.json`, `vitest.config.ts`; scripts `test:v1`, `typecheck:v1`, `bench`, `compare`
- [x] v0 npm alias `json-fx-v0` → `@mindsung/json-fx@0.1.25` (exact pin)
- [x] Conformance runner (`test/conformance.test.ts` + `test/harness/`) that drives v0 through an engine adapter; format documented in `test/conformance/README.md`
- [x] Seed corpus: **370 cases** — 278 `same`, 77 `differs` (A:33, B:27, C:5, D:12; each records what v0 actually does and the test fails if v0 starts passing), 15 `skip` (v1-only). Ported from users/dynamic-field/misc-debug/readme specs, README, `archive/examples`, `examples/`, the `fn-*` specs (as template-level stdlib cases), and every repro from §3.2/§3.3. `misc-debug` expectation fixed to 10.
- [x] Bench harness: `bench/` with 6 fixtures (Appendix C `order`, flat-projection, string-heavy, nested-lambdas, deep-chains, recursion), output-equality check against hand-written JS before timing, `bench/BASELINE.md` (v0 numbers: order 33.6 µs, nested-lambdas 51 µs, …)
- [x] `compare` harness (`bench/compare.ts`, v1 side stubbed → exits 2 until v1 exists), runnable sample in `bench/compare-sample/`, private `real-templates/` (git-ignored contents)

### How to run things (from `json-fx/`)
```sh
npm run test:v1         # conformance corpus against v0 (and v1 engines once they exist)
npm run typecheck:v1    # TS 5, strict
npm run bench           # or: npm run bench -- order | npm run bench -- --markdown
npm run compare -- bench/compare-sample      # v0 vs v1 side by side (default dir: real-templates/)
# v0 baseline (unchanged: 73 passing / 23 failing), command from V1-PLAN.md §0:
NODE_OPTIONS="--no-experimental-require-module --no-experimental-detect-module" \
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' TS_NODE_TRANSPILE_ONLY=true \
npx mocha -r ts-node/register --exclude ./src/tests/scripts/pure-fx.spec.ts "./src/**/*.spec.ts"
```

## Deviations from the plan
1. **TypeScript:** root `typescript` is pinned to `~4.9.5`, not 5.x. TS 5.5 removed `suppressImplicitAnyIndexErrors`, which v0's root `tsconfig.json` uses, so TS 5 as `typescript` breaks the v0 mocha baseline. v1 uses TS 5.9 through the alias `typescript5` (`npm run typecheck:v1` calls its `tsc`). At cut-over (Phase 6) delete v0, set `typescript` to 5.x and drop the alias.
2. **tsup 5 → 8** and **@types/node 12 → 22** were bumped (peer-dependency conflicts with TS 4.9/vitest). Neither affects the v0 tests. `package-lock.json` churned heavily as a result.
3. **vitest 3.2**, not 5: vitest 5 needs Node ≥ 22.12, while the library targets Node ≥ 18 and dev tooling should too.
4. **Layout:** `test/`, `bench/`, `real-templates/` sit at the package root (`json-fx/`), next to v0's `src/`. `src-v1/` is not created yet (first needed in Phase 2); `tsconfig.v1.json` and `vitest.config.ts` already include it.
5. **Added `tsx`** (runs `bench/*.ts`).
6. **ESLint not added yet.** Linting for v1 comes with the toolchain cut-over; v0 keeps tslint.
7. **Corpus additions beyond the plan's lists:** `change: "D"` (host/API hardening), per-run `v0Actual*` records, `expectCalls`, and the `$$undefined` / `$$fixture` sentinels in the case format.

## New findings (not in V1-PLAN.md §3.2)
Each is in the corpus (`bug: "NEW"` or `B18`). Owner confirmed the `toISOLocalDateTime` and malformed-input items on 2026-10-14; the corpus encodes them.
- **B18 — `if … else if … else` associates left in v0.** `A if C1 else B if C2 else D` parses as `(A if C1 else B) if C2 else D`, so `'minor' if $a < 18 else 'senior' if $a >= 66 else 'adult'` gives `'adult'` for 16. (There is a `TODO: if/else right-hand associativity` in `fx/index.ts`.) The plan's §5.3 already specifies right associativity, so this is just a missing Class B entry. Corpus: `users-scripts.json`.
- **`toISOLocalDateTime` ignores its first argument** and formats `Date.now()` (`fx/functions/fn-time.ts`). Corpus expects the evident intent. **Confirmed (owner, 2026-10-14):** fix it when porting stdlib in Phase 2.
- **v0 accepts malformed input silently:** an unterminated string literal (`'abc` → `"abc"`) and a lone operator (`+` → `NaN`). Corpus encodes `FxSyntaxError` for both. **Confirmed (owner, 2026-10-14):** both become syntax errors (Class B, detectable by `check`).
- **v0 returns `[1, function]` for `$o['a','constructor']`** (multi-index reads prototype keys). Part of the §4.6 hardening; the exact v1 result for blocked keys in `{k}` picks is left undecided (the `$o{a, constructor}` case is `skip`).
- Mutual recursion (`@even`/`@odd`) and several nested-call shapes work in v0 by luck; only direct recursion and the `misc-debug` template actually break (B2). Those cases are kept as `same` regression guards.
- Reminder when writing templates: a JSON key starting with `$` is always a variable declaration (`${x}` is not a literal key).

## Notes for the next session (Phase 2 — front end)
- Start by reading `test/conformance/README.md`, then V1-PLAN.md §4.2–§5.5. The corpus is the contract; the 15 `skip` cases and the 77 `differs` cases show the intended v1 differences.
- Create `json-fx/src-v1/` (errors, `api/types.ts`, `syntax/ast.ts`, scanner, parser, template reader, `stdlib/` port with `pure` metadata; fix B13 sort, remove `funny`, check `toISOLocalDateTime`). The v1 engine adapter goes in `test/harness/engines.ts` (replace the `v1Engine` stub; register it in `test/conformance.test.ts`'s `engines` list and `bench/engines.ts`). Phase 2's exit is that every corpus template parses to an AST (or the expected syntax error), so add a parse-only mode/test.
- Stdlib unit tests: the v0 `fn-*.spec.ts` files are mocha/JS-level; port them to vitest alongside `stdlib/` (the template-level coverage is already in `stdlib.json`).
- `bench/compare.ts`'s DIFF path is untested until a v1 engine exists; verify it in Phase 3.
- Still open from the owner: **Q8** (real templates for `real-templates/`; needed by Phase 6, see below).
