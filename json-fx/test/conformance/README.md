# Conformance corpus

Language-agnostic JSON cases (V1-PLAN.md §9) that every engine must pass. They are run by `test/conformance.test.ts`
(`npm run test:v1`) through the engine adapters in `test/harness/engines.ts`. v0 and the v1 closure backend are wired up
(every case, including the `v0: "skip"` ones, must pass on v1); the same corpus also runs on the codegen backend (Phase 4).

## File layout

A file is either an array of cases or `{ "defaults": {...}, "cases": [...] }` (defaults are merged under each case, shallow).
Keep one case per line so diffs stay reviewable. Case names are unique across the whole corpus.

| File | Contents |
|---|---|
| `expressions.json` | literals, operators, precedence, conditionals, lambdas, function-call syntax |
| `chains.json` | property/index/pick/invoke chains and the `?` null-conditional rules |
| `objects.json` | object templates, variables, user functions, scope, promotion `()`, dynamic and optional keys |
| `stdlib.json` | every built-in function, exercised through templates |
| `users-scripts.json`, `readme.json`, `misc-debug.json`, `archive-examples.json` | ported from the v0 specs, README, `archive/examples`, `examples/` |
| `bugs.json` | repros for the verified v0 bugs (V1-PLAN.md §3.2) |
| `security.json` | the §3.3 payload, prototype/inherited-function hardening (§4.6), hostile keys/literals |
| `compat.json` | behavior deliberately kept from v0 (§7.2): bare words, missing inputs, host callbacks |
| `errors.json` | syntax/compile/runtime errors and their types |

## Case fields

```jsonc
{
  "name": "…",                       // unique
  "template": …,                     // any JSON; a string is a single expression
  "inputs": { "$": …, "$other": … }, // optional
  "expect": …,                       // or "expectError": { "type": "FxSyntaxError|FxCompileError|FxRuntimeError", "match": "substring", "phase": "compile|run" }
  "expectCalls": { "tick": 1 },      // invocation counts of call-counting test functions during the run
  "functions": ["tick"],             // test extension functions to register (test/harness/fixtures.ts)
  "options": { "inputs": ["$"], "strictIdentifiers": true }, // compile options (v1 only → v0 must be "skip")
  "runs": [ { "inputs": …, "expect": … }, … ],               // several evaluations of one compiled template
  "tags": […], "source": "…", "note": "…",
  "v0": "same | differs | skip",
  "change": "A | B | C | D", "bug": "B3"
}
```

Sentinels (JSON can't express these), decoded in `inputs`, `expect` and `v0Actual`:
`{ "$$undefined": true }` → `undefined`; `{ "$$fixture": "fmt" }` → a fresh value from `fixtures.ts` (host callbacks, class instances).

Output comparison is `util.isDeepStrictEqual`, so `{ a: undefined }` ≠ `{}` (undefined-valued keys are present in v1 output, as in v0).

## The `v0` field

| Value | Meaning |
|---|---|
| `same` | v0 must satisfy the case. For error cases v0 only has to throw (and match `match`): its error *type* and *phase* aren't comparable, since v0 throws `FxCompileError` for everything. |
| `differs` | Known v0 bug or accepted change. v0 must **not** satisfy the case — the test fails if v0 starts passing — and must still do what the case recorded in `v0Actual` / `v0ActualError` / `v0ActualCalls`, so the claim can't rot. Needs `change` and `bug` or `note`. |
| `skip` | v1-only feature or option. |

`change` classes follow V1-PLAN.md §7.1: **A** v0 threw/was unusable, **B** bug fix that changes the output of a template that
ran without error, **C** accepted semantic change, **D** host/API hardening. `bug: "NEW"` marks findings that were not in
the plan (see V1-PROGRESS.md).

## Adding cases

Add the case with the behavior v1 should have. Run `npm run test:v1`; if v0 disagrees, set `v0: "differs"` with `change`
and `bug`/`note`, and record what v0 does (the values appear in the failure message). Do not edit a `same` expectation to
make v0 pass without checking the plan.
