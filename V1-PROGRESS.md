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

### Decided during Phase 3 (owner, 2026-10-15)
- A key pick `$o{a, constructor}` **omits** blocked keys (`__proto__`, `constructor`, `prototype`) instead of emitting them as `undefined`; a multi-index `$o['a', 'constructor']` still returns `[1, undefined]` (positional).

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
| 2 | **Phase 2** — errors, types, AST, scanner, Pratt parser, template reader, stdlib port (with `pure` metadata; fix B13, remove `funny`) | **done** (2026-10-15) |
| 3 | **Phase 3** — resolver, closure backend, runtime helpers (security rules), public API (`run`/`evaluate`/`defineGlobal`), security tests | **done** (2026-10-15) |
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

### Session 2 — Phase 2, front end (done)
- [x] `src-v1/errors.ts` (`FxError` > `FxSyntaxError` / `FxCompileError` / `FxRuntimeError`; messages append `path`, line and column), `src-v1/api/types.ts`, `src-v1/api/registry.ts`, `src-v1/syntax/ast.ts`
- [x] `syntax/scanner.ts`: maximal munch over the registry's operator symbols (+ structural `. ?. : ?: ?[ ?{`), word operators, `1e3`, `\'` / `\\` escapes, digits after `.` are property keys, unterminated string = syntax error
- [x] `syntax/parser.ts` (Pratt, §5.3), `syntax/object-builder.ts` (shared by literals and the reader), `syntax/template-reader.ts` (§5.4), `syntax/print.ts` (S-expression printer for tests/debugging)
- [x] `stdlib/` ported with `pure` metadata; B13 sort fixed, `funny` removed, `toISOLocalDateTime` fixed, `notNull`/`throw` raise `FxRuntimeError` (B16)
- [x] Tests: scanner, parser (AST strings), template reader, stdlib (ported from the three v0 `fn-*.spec.ts` plus new B13/time/error cases), and `test/parse-corpus.test.ts`: **all 370 corpus templates parse** (or give the expected `FxSyntaxError` / reader-level `FxCompileError`). Whole suite: 820 passed / 15 skipped (the skips are the engine cases waiting for v1); v0 baseline unchanged (73 / 23).

### Session 3 — Phase 3, resolver + closure backend + public API (done)
- [x] `semantics/resolve.ts` (+ `suggest.ts`): scope tree and bindings, unknown functions / `@names` with "did you mean", declared-input checking, `strictIdentifiers`, bare-word list, duplicate declarations, var cycles (B11, with the cycle path), `ifElse`/`and`/`or` arity errors, arity warnings
- [x] `runtime/helpers.ts`: hardened `get`/`getDynamic`/`getBlocked`/`index`/`pick`, `setOwn`, `dynamicEntries`, `missing`, `wrap`, `lazyArg`
- [x] `backend/closure/compile.ts`: frames with (depth, slot) refs, lazy memoized vars, re-entrant functions/lambdas, chains, objects, dynamic and optional keys, lazy calls
- [x] `api/json-fx.ts` + `src-v1/index.ts`: `JsonFx` (`define`, `defineGlobal`, `compile`), compiled template with `run` / `evaluate` / `clearInputs` / `warnings` / `bareWords`
- [x] v1 closure engine registered in the conformance harness, compare harness and bench. **All 370 corpus cases pass on the closure backend** (the 15 `v0: skip` cases run on v1). `npm run compare -- bench/compare-sample` shows the expected B3 difference only.
- [x] Tests: resolver, helpers, API, closure semantics, `test/security.test.ts`. Whole suite: 1306 passed / 18 skipped (the skips are the v0-side `skip` cases, 15 + 3 new); v0 baseline untouched.
- [x] Benchmarks recorded in `bench/V1-CLOSURE.md` (closure ≈ 7× faster than v0 on `order`, 5× on `nested-lambdas`)

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

### Phase 2 deviations and decisions
8. **No `emit` metadata on built-ins yet.** The plan lists it under Phase 2, but its format belongs with the code generator; it is added in Phase 4 together with `emit.ts`.
9. **Internal `intrinsic` marker** on `FxFunctionDef` (`'and' | 'or' | 'ifElse'`) tells the parser which built-ins to lower (`&&`/`||`/`and()`/`or()` → `logical`, `ifElse` → `cond`). Redefining the name drops the marker, so an extension can replace them.
10. **`FunctionRegistry`** (`src-v1/api/registry.ts`) is new: the parser/scanner/resolver all read functions and operators from it. It validates names and operator symbols (no quotes, sigils, identifier characters or brackets; symbol or word operators only).
11. **Unary minus is registered as `-`** (`neg`, `isUnary`), not v0's internal `-u`; the parser picks unary vs binary by position.
12. **Unknown call names parse fine** (`FnRef.def` is `undefined`); the resolver (Phase 3) reports them with suggestions. A bare word is a `literal` with `bareWord: true`, or a zero-argument `call` if registered.
13. **`:fn` with a deferred-evaluation or intrinsic function is desugared by the parser** into `lazyCall`/`cond` with the receiver as first argument (`$a.b:catch('d')`), so the IR has no lazy invoke step. `?:` on such a function is a `FxCompileError`.
14. **Pick keys:** a bare name in `{a, b}` is always the string key, never a function call (so `$o{first}` works); anything else is an expression.
15. **`()` next to fields is a `FxCompileError` raised by the reader** (`object-builder.ts`), per §5.4 (v0 threw at run time).
16. **`toISOLocalDateTime`** defaults the offset to the host's offset *at the given date* (v0 used "now"'s offset); the offset argument follows `getTimezoneOffset()` (minutes west of UTC).
17. **Whitespace-only expression strings are `null`**, as an empty one is (verified against v0).
18. Tests for `src-v1/` live next to the code (`*.test.ts`); corpus-driven ones in `test/`.
19. Inline object literals have no optional-key form (`name?`); write `{ 'name?': … }` only in JSON templates. Not in the plan; add later if wanted.

### Phase 3 deviations and decisions
20. **Frames only for scopes that declare names.** `ScopeInfo` is created only when an object has declarations, a lambda/function has parameters, or a dynamic key has `as` bindings; `ScopeInfo.parent` skips the others and `RefNode.depth` (new, set by the resolver) counts frames. The plan's "mark captured bindings" is not needed by the closure backend (frames are heap objects); revisit only if the codegen backend wants it.
21. **AST additions:** `RefNode.depth`, `scope?` on `fn` decls and dynamic fields, `Binding.name`, a `root` scope kind (pseudo-scope of inputs/globals), `FxError.templateName`.
22. **Lookup order for `$name`:** local scopes → declared input (`CompileOptions.inputs`) → global (bound at compile time, value read at run time) → (undeclared inputs only) run-time input lookup that throws if absent.
23. **Cycle detection is two-layered.** The resolver finds direct var → var cycles (skipping lambda/function bodies and vars declared in nested objects); anything it misses (e.g. through a function call) trips an in-progress sentinel at run time and raises `FxRuntimeError: Cyclic reference`.
24. **Errors:** every field, array item, variable and function body wraps what it catches in `FxRuntimeError` with the *innermost* source path (an error inside `@f` reports `@f`'s own path, not the caller's); `run()` adds `templateName`. Native errors keep their TypeError as `cause`.
25. **Arity:** `ifElse`/`and`/`or` with the wrong argument count are compile errors; for other functions only `params`-declared extra arguments produce a *warning* (`compiled.warnings`). `evaluate.length` is not used (it can't see optional parameters, and the stdlib has no `params`).
26. **Dynamic key over a scalar** (`{ 5 as $v, $k }`): single key `String(value)`, `$k` = `0`. Not specified in the plan.
27. **`backend` option:** `'codegen'` throws `FxCompileError` until Phase 4; `'auto'` currently means closure.
28. **Stdlib hardening found while writing the security tests:** `item(arr, key)` read `arr[key]` with a template-controlled key (`item($, 'constructor')` reached the Object constructor and, chained, `Function`: the §3.3 gadget survives through the stdlib); it now uses the hardened read. `assign` and `filter` copied an own `__proto__` key with `Object.assign`/assignment, which replaces the result's prototype (a JSON input could make the result inherit `isAdmin`); both now copy it as data (`setOwn`). New corpus cases in `security.json`. **Rule for Phase 4/5 and extensions:** any built-in that indexes by an argument must use `runtime/helpers`.
29. **Pick keys that are missing** stay present as `undefined` (as in v0): `$o{a, zz}` → `{a: 1, zz: undefined}`.
30. **Optimization done in Phase 3:** `apply`/`invokeUser` specialized for 0–2 arguments (recursion fixture 10.4 → 3.8 µs). More is left to the code generator.

## New findings (not in V1-PLAN.md §3.2)
Each is in the corpus (`bug: "NEW"` or `B18`). Owner confirmed the `toISOLocalDateTime` and malformed-input items on 2026-10-14; the corpus encodes them.
- **B18 — `if … else if … else` associates left in v0.** `A if C1 else B if C2 else D` parses as `(A if C1 else B) if C2 else D`, so `'minor' if $a < 18 else 'senior' if $a >= 66 else 'adult'` gives `'adult'` for 16. (There is a `TODO: if/else right-hand associativity` in `fx/index.ts`.) The plan's §5.3 already specifies right associativity, so this is just a missing Class B entry. Corpus: `users-scripts.json`.
- **`toISOLocalDateTime` ignores its first argument** and formats `Date.now()` (`fx/functions/fn-time.ts`). Corpus expects the evident intent. **Confirmed (owner, 2026-10-14):** fix it when porting stdlib in Phase 2.
- **v0 accepts malformed input silently:** an unterminated string literal (`'abc` → `"abc"`) and a lone operator (`+` → `NaN`). Corpus encodes `FxSyntaxError` for both. **Confirmed (owner, 2026-10-14):** both become syntax errors (Class B, detectable by `check`).
- **v0 returns `[1, function]` for `$o['a','constructor']`** (multi-index reads prototype keys). Part of the §4.6 hardening; decided 2026-10-15: a `{k}` pick omits blocked keys.
- Mutual recursion (`@even`/`@odd`) and several nested-call shapes work in v0 by luck; only direct recursion and the `misc-debug` template actually break (B2). Those cases are kept as `same` regression guards.
- Reminder when writing templates: a JSON key starting with `$` is always a variable declaration (`${x}` is not a literal key).

## Notes for the next session (Phase 4 — JS codegen backend)
- Read V1-PLAN.md §5.8 (emission rules), Appendix B (prototype; throwaway), §4.6 item 3 (generator hygiene) and Phase 4 in §8. The resolved AST is the input: `ref.binding`/`ref.depth`, `ObjectNode.scope`, etc. (see deviations 20–23). `backend/closure/compile.ts` is the semantic reference; `runtime/helpers.ts` is shared, generated code should call it for hardened reads (`get`, `getDynamic`, `getBlocked`, `index`, `pick`, `setOwn`, `dynamicEntries`, `missing`, `wrap`, `lazyArg`).
- Behaviours the generator must match (all in the corpus or the unit tests): lazy memoized vars with a per-entry cycle sentinel, fresh variables per object entry/function call, lambda arg normalization, innermost-source error wrapping (deviation 24), `?` guard returning `null` for the whole chain, optional keys, `__proto__` output keys via `setOwn`/computed key, dynamic-key frames.
- Add the codegen engine next to `v1ClosureEngine` in `test/harness/engines.ts` and `test/conformance.test.ts`, and `benchEngines`; then the differential test (closure vs codegen) per Phase 4. `JsonFx.compile` already routes `backend`; `FxCompiledTemplate.source` is reserved for the generated JS.
- Built-in `emit` metadata (inline table) still doesn't exist (deviation 8); add with `emit.ts`.
- Optimizer reminders (Phase 5): fold only when the result is a primitive (or frozen); never fold `range` with a large result; `dateTime` returns a mutable `Date`.
- Still open from the owner: **Q8** (real templates for `real-templates/`; needed by Phase 6, see below).
