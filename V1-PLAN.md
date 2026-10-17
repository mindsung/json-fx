# JSON-fx v1 — Design & Implementation Plan

> **Status:** proposal, written 2026-10-14 from a review of `develop` @ `294e392` (package `@mindsung/json-fx` 0.1.24/0.1.25).
> **Audience:** the maintainer, and whoever (human or agent) picks up the implementation in a fresh session.
> Everything marked *measured* or *verified* below was actually run against the current code; repro snippets are included so it can be re-checked.
>
> **Decisions recorded (owner, 2026-10-14):**
> - Parentheses end a `?` chain (JS semantics) — accepted despite the v0 difference (§4.3).
> - Optional keys `"name?"` are implemented (omit when null/undefined) — accepted despite the v0 difference (§5.4).
> - Bare words in value position stay string constants (v0-compatible); only unknown names in *call* position are compile errors (§4.4, §5.3).
> - Function values that are **own** properties of inputs remain usable (e.g. host callbacks); inherited/prototype functions are blocked (§4.6).
> - A reference to a missing input still throws at run time, lazily, as in v0 (§4.4).
> - Trust model: for our own projects, template authors are trusted. As a published library, json-fx makes no sandbox guarantee and documents the risks (§4.6).
> - Compatibility policy and release gate: §7.

---

## 0. Quick start for a new session

1. Read §1 (summary), §3 (findings) and §5 (architecture). §8 is the task list; §10 has the questions the owner must answer before or during implementation.
2. Current test suite (v0) runs on Node 22 only with overrides, because ts-node 8 + `"module": "es2015"` (root `tsconfig.json`) don't load under Node 22:
   ```sh
   cd json-fx
   npm ci
   NODE_OPTIONS="--no-experimental-require-module --no-experimental-detect-module" \
   TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' TS_NODE_TRANSPILE_ONLY=true \
   npx mocha -r ts-node/register --exclude ./src/tests/scripts/pure-fx.spec.ts "./src/**/*.spec.ts"
   ```
   Baseline (verified): **73 passing, 23 failing**. `pure-fx.spec.ts` must be excluded because it reads `../examples/03-advanced.fx`, which moved to `archive/examples/json/`. See §3.5 for what the failures are.
3. The published v0 build used for all measurements is at `examples/node_modules/@mindsung/json-fx` (minified). An unminified, debuggable bundle can be made with
   `npx esbuild@0.24.0 json-fx/src/index.ts --bundle --platform=node --keep-names --outfile=<scratch>/fx-unmin.js`.
4. The code-generation prototype and benchmark harness used for the numbers in this document are reproduced in **Appendix B/C**. Recreate them in a scratch directory to re-measure; they are deliberately not part of the repo.
5. Work on a branch (e.g. `v1`); keep `develop` releasable for v0 until v1 ships. Tag the current state `v0-final` before deleting v0 code.

---

## 1. Summary

JSON-fx compiles a JSON template (object/array/string expressions with variables, user functions, lambdas and a function library) and evaluates it repeatedly against different inputs. The **goal of v1 is fast, correct, safe repeated evaluation of a compiled template**. Parse/compile speed is not a goal.

Key conclusions:

| Topic | Conclusion |
|---|---|
| **Execution model** | Replace the tree-walking interpreter with **compilation to JavaScript source** (`new Function`), plus a **closure-compiling fallback** backend for environments that forbid `eval` (strict CSP, Cloudflare Workers). A prototype was **~110× faster** than v0 on a realistic template (35.4 µs → 0.33 µs per evaluation) and within ~1.7× of hand-written JS. |
| **Language/runtime** | **Stay in TypeScript/JS.** For a JS host, any native engine (Rust/N-API/WASM) loses at the boundary: `JSON.stringify`+`JSON.parse` of a 400-byte input alone costs ~3 µs, ~10× the whole generated-JS transform. A native engine only makes sense for a non-JS, bytes-in/bytes-out workload; keep that as a possible later track that reuses the conformance suite (§9). |
| **Front end** | **Rewrite the lexer/parser** as a single hand-written scanner + Pratt parser producing a typed AST. The v0 multi-pass token-tree mutation pipeline is the source of several correctness bugs (tokenizer merges, unary precedence, dynamic keys) and is hard to extend safely. Keep the surface syntax (with the fixes in §4). |
| **Syntax** | Keep `:` for function invocation (`.` = property, `:` = function — a static distinction that compile-time resolution depends on). Make `?` guard **the whole remainder of a chain** (JS optional-chaining semantics) across `.`, `:`, `[]`, `{}`. |
| **Semantics** | Lexical scoping resolved at compile time; per-evaluation lazy memoization of object `$vars`; re-entrant/recursive user functions; compiled templates are pure functions of their inputs. |
| **Extensibility** | Public extension API (`{ name, evaluate, operator?, deferEvaluation?, params? }`) stays source-compatible; add optional `pure`/`async` metadata; replace `fx.scope` with `defineGlobal`. Intrinsics become internal emitters. |
| **Security** | v0 templates can **execute arbitrary JavaScript** (verified, §3.3). Template authors are trusted in our own projects, but as a published library v1 hardens by default (prototype-path and inherited-function reads blocked; the code generator never splices template text into source) and documents clearly that json-fx is **not a sandbox** for untrusted templates (§4.6). |
| **Bugs** | 15+ correctness bugs verified in v0 (§3.2), including exponential re-evaluation for `?:`, broken recursion, non-short-circuiting `&&`/`||`, `-$.x` evaluating as `(-$).x`, `1e3 → 1`, `['a','b'] → ['a', ',b']`, and unknown function names silently evaluating to their own name as a string. |
| **Compatibility** | v1 is **not** bug-for-bug compatible: some fixes necessarily change the output of templates that run without error today, and two deliberate semantic changes were accepted. Every change is classified, statically detectable by `json-fx check`, and a v0/v1 side-by-side diff over real templates is a release gate (§7). |

---

## 2. How v0 works (orientation)

```
template (any JSON)
  └─ TemplateGrouper (lexer/template-grouper.ts)   JSON → token tree; string values → Tokenizer + Grouper
       └─ ScriptParser (lexer/script-parser.ts)   RecursiveParser running, in order, over the whole tree:
            OperatorLoader   (tags operators, unary minus, object ':' vs invoke ':', dynamic keys)
            ExpressionParser (calls, [] indexers, {} key indexers)
            OperatorParser   (shunting-yard precedence)
            DefinitionLoader (attaches definition/compiler hooks by tag/symbol)
       └─ root.optimize() / root.validate()        per-definition rewrite hooks (unwrap groups, ':' → call, etc.)
  └─ root.compile()                                → FxExpression tree (runtime/*)
  └─ expr.bindScope(scope)                         every node gets its own FxScope; scopes chained up the tree
evaluate(...inputs)
  └─ input FxConstantVariables set on the template scope (replaceValue → clearCache cascade)
  └─ expr.evaluate()                               recursive tree walk
```

Runtime node types (`json-fx/src/runtime/`): `FxConstant`, `FxReference` (variable lookup by name, walking the scope chain), `FxFunction` (evaluator + args, optional `deferEvaluation`), `FxLambda` (sets parameters as scope variables on its **single shared scope**), `FxProperty` (dot path with `interrupts` for `?.`), `FxObject` (fields + scope variables + optional `()` output), `FxArray`, `FxStaticField`, `FxDynamicField`, `FxScopeVariable` (lazy, cached, invalidated through a runtime-discovered `dependents` list).

Public API (`json-fx/src/index.ts` exports `fx/json-fx.ts` and `model/fx-definition.ts`):
```ts
new JsonFx(...definitionSets: FxExpressionDefinition[][])
fx.define(def)                       // add a function after construction
fx.scope                             // FxScope; used by archive/json-fx-sandbox to inject globals via deep import
fx.compile(template) → { evaluate(...inputs: {name, value}[]), clearInputs(), toString() }
```
Note: `evaluate` is **stateful**: inputs persist between calls (a later call only replaces the inputs it names). `ScriptTester` in the tests relies on this.

---

## 3. Findings

### 3.1 Performance (measured)

Benchmark fixture: Appendix C (order document, ~400 bytes, 10 line items; template with a constant `$var`, two `@functions`, `map`/`filter`/`reduce` with lambdas, `?.`, math, string ops). Node 22.22, Apple Silicon.

| Implementation | µs / evaluation |
|---|---|
| v0 `compiled.evaluate` (published minified build) | **35.4** |
| Prototype codegen, no inlining | 0.73 |
| Prototype codegen, operators/user-calls inlined | **0.33** |
| Hand-written JS equivalent | 0.19 |
| (reference) `JSON.stringify` of one input | 0.87 |
| (reference) `JSON.parse` of one input | 2.04 |
| v0 compile time for the template (not a goal) | ~214 |

The prototype produced identical output to v0 on all 1000 benchmark inputs.

CPU profile of v0 (self time, unminified build): `FxFunction.evaluateArgs` ~20%, `FxLambda.evaluator` ~16%, GC ~7%, `FxScope.setVariable` ~5%, `FxReference.evaluate` ~5%, `bindScope` ~4%, `FxConstant` constructor ~3%, `isScopeVariable` ~3%. Root causes:

- **Per lambda invocation, per argument**: allocates `FxScopeVariable` + `FxConstant` (each with its own `FxScope` and `sourceRef` object), then `setVariable` → `clearCache()` cascade over dependents + `bindScope`. `FxLambda.evaluate()` also does `this.evaluator.bind(this)` every time the lambda value is produced (`runtime/fx-lambda.ts:19-27`).
- **Every function call**: `this.args.map(p => p.evaluate())` then spread (`runtime/fx-function.ts:24`).
- **Every variable reference**: walks a scope chain as deep as the expression tree, allocating a `dependents` array and doing `indexOf` de-duplication on every lookup (`runtime/scope/fx-scope.ts:15-23`).
- **Every object field**: `field.evaluate()` returns a fresh `[{key, value}]` array (`runtime/fx-object.ts:46`).
- User-function calls go through a generic `(lambda, ...args) => lambda(...args)` wrapper (`fx/def/call-def.ts:17`).

### 3.2 Correctness bugs (all verified)

| # | Bug | Repro (input in brackets) | Actual | Expected | Cause |
|---|---|---|---|---|---|
| B1 | `?:` evaluates its receiver twice per level → **exponential** | `$:tick?:toString?:toString…` (n levels) | receiver evaluated 2ⁿ times (n=12 → 4096) | once | `NullInvokeDef` evaluates `fn.args[0]` then `fn.evaluate()` re-evaluates it (`fx/def/invoke-def.ts:34-37`) |
| B2 | User functions/lambdas are **not re-entrant** (recursion and nested self-calls clobber parameters) | `{"@f($n)": "ifElse($n <= 1, 1, @f($n - 1) * $n)", "()": "@f($)"}` [5] | `1` | `120` | Parameters stored on the lambda's single shared scope (`runtime/fx-lambda.ts:25`). Also the cause of the failing `misc-debug` test (see §3.5) |
| B3 | `?` does not short-circuit the rest of the chain once `:` is involved | `$a?.b:toUpperCase`, `$a?:toString.length`, `$a?.b?:toUpperCase:length`, `$a?.b:item(0).c` [$a=null] | throws | `null` | `?.` only interrupts its own `FxProperty`; `?:` only its own call; following steps are separate nodes that receive `null`. (Pure `.`/`?.` chains do work: `$a?.b.c` → `null`.) |
| B4 | `&&` / `\|\|` don't short-circuit | `$ != null && $.x` [null] | throws | `false` | `and`/`or` are ordinary eager functions (`fx/functions/fn-logical.ts:5,10`) |
| B5 | Prefix unary operators bind tighter than postfix `.`/`:` | `-$.x` [{x:5}], `!$.f` [{f:false}] | `undefined`, `undefined` | `-5`, `true` | `OperatorParser.parseTerm` pops a pending unary operator immediately after the first term (`lexer/operator-parser.ts:57`) |
| B6 | String literal directly after an operator character absorbs the operator | `['a','b']`, `'a'+'b'` | `["a", ",b"]`, `"a"` | `["a","b"]`, `"ab"` | Opening quote is tokenized as an operator char, merged with the preceding operator token, then that token is turned into the literal (`lexer/tokenizer.ts:53,61`) |
| B7 | Exponent number literals silently truncated | `1e3`, `1.5e2` | `1`, `1.5` | `1000`, `150` | `numeric` token rule doesn't accept `e`; stray `e3` token dropped (`fx/rules.ts`) |
| B8 | Unknown function in *call* position silently evaluates to its own name | `$:uppercase`, `$:toUppercase()`, `lowercse($)` ['Hello'] | `"uppercase"`, `"toUppercase"`, `"lowercse"` | compile error | `IdentifierDef.compile` falls back to a string constant when no evaluator exists, discarding any arguments (`fx/def/expression-def.ts:41`). This also hides the fact that several tests/examples use old names (`lowercase`, `uppercase`, `titlecase`). Note: the same fallback for a bare word in *value* position (`"kind": "order"` → `"order"`, `ifElse($.x, yes, no)` → `"yes"`, `foo + 1` → `"foo1"`) is relied on by working templates and is **kept** in v1 (§4.4) |
| B9 | Dynamic keys (`{ expr as $v, $k }`) unusable | `{"{ ['A','B'] as $v, $i }": "$v + $i"}` | throws `"as" is only valid within a dynamic key declaration` | `{"A":"A0","B":"B1"}` | `OperatorLoader.parseObject` only recognizes `array` tokens as dynamic keys (`lexer/operator-loader.ts:61`); `{…}` keys are tagged `object`. Likely regressed around `678823e` "Implemented object indexer" (2019). Also the object-source parameter order in `FxDynamicField` (`lambda(key, value)`) disagrees with the tests' expectation (`$v`=value, `$k`=key) |
| B10 | Optional keys (`"foo?"`) not implemented | — | key is literally `"foo?"` | omit when null | Broken since `9748c7f` ("…broke optional (?) fields"); TODO in `runtime/fx-object.ts` |
| B11 | Cyclic variables overflow the stack at runtime | `{"$a": "$b", "$b": "$a", "()": "$a"}` | `RangeError: Maximum call stack size exceeded` | compile error | no dependency analysis |
| B12 | Stray debug operator: postfix unary `?` named `funny` meaning `== 1` | `1 ?` | `true` | syntax error | `fx/functions/fn-logical.ts:25` |
| B13 | `sort` comparator never returns 0 (inconsistent comparator → engine-dependent order; unstable for equal keys) and evaluates the key lambda O(n log n) times | `[…]:sort($x => 0)` | — | stable | `fx/functions/fn-collection.ts:25` |
| B14 | No way to put `'` in a string literal | `'it''s'` | `"it"` | — | no escape syntax |
| B15 | `FxCompiledTemplate` is stateful/not re-entrant; `$vars` without input dependencies are cached **across** evaluations (e.g. `"$t": "now()"` never changes after the first call) | — | — | per-evaluation | caching model in `runtime/scope/fx-scope-variable.ts` |
| B16 | Runtime errors are thrown as `FxCompileError` (`notNull`, `throw`, undefined variable) | — | — | runtime error type | `fx/functions/fn-error.ts`, `runtime/fx-reference.ts` |
| B17 | `examples/collection.js` comment shows `'a,b,c'` twice; actual output (correct) is `'d,e,f'` for the second item | — | — | — | stale comment |

### 3.3 Security (verified)

**Templates can construct and run arbitrary JavaScript in v0.** This returns `"object"` for `typeof process` (i.e. a payload has full access to the Node process):
```json
{
  "$F": "$.constructor.constructor",
  "$made": "['return typeof process']:max($F)",
  "()": "[1]:max($made)"
}
```
Two gadgets combine: (1) property reads are unrestricted, so `.constructor.constructor` reaches `Function`; (2) any value can be passed where a lambda is expected, and `max` calls it with a single argument (`Function(body)` → new function), then a second `max` invokes the result.

This matters only if templates can be authored by anyone less trusted than the code that runs them (tenants, customers, admin UIs). **Trust model (decided):** in our own existing and upcoming projects, template authors are trusted, so this is not an urgent fix for us. As a general-purpose published library, though, json-fx can't know how it will be deployed, so v1 hardens by default and documents the remaining risks (§4.6). Code generation raises the stakes: an escaping bug in the generator becomes direct code injection, so the generator has strict emission rules and a fuzz suite. Those rules are also needed for correctness, since even trusted authors write keys and literals containing quotes, backslashes, etc.

Also noted: an object literal emitted as `{"__proto__": v}` sets the prototype instead of creating a key; output objects with a `__proto__` key must be emitted with a computed key (`{["__proto__"]: v}`). The Appendix B prototype does **not** handle this.

### 3.4 Extensibility as it exists

| Surface | Public? | Users seen |
|---|---|---|
| Extension functions `{ name, evaluate, operator?, deferEvaluation?, params? }` (constructor / `fx.define`) | yes | `archive/json-fx-crypto`, `archive/json-fx-test` |
| Custom operators via `operator: { symbol, precedence, assoc?, isUnary? }` | yes | built-ins only |
| Lambdas received by extension functions as plain JS functions | yes | `map`, `filter`, … |
| `deferEvaluation: true` → arguments are `FxExpression`s; contract actually used: `.evaluate()` **and `.sourceRef`** (`throw` reads it) | yes | `ifElse`, `catch`, `throw` |
| Intrinsics (`FxIntrinsicDefinition` with optimizer/validator/compiler hooks returning `FxExpression`) | **no** — `JsonFx` only calls `defineExpression` | `in`, `else`, `as`, … in `fx/index.ts` |
| Globals via `fx.scope.setVariable(new FxScopeVariable(...))` | semi (deep import) | `archive/json-fx-sandbox/src/shell/index.ts:44` |

### 3.5 Test suite & toolchain state

- Toolchain is dated: TypeScript 4.3, ts-node 8, mocha 6, chai 4, tslint (deprecated), tsup 5; root `tsconfig` targets ES2015 with `lib: es2016, dom`; `polyfills.ts` polyfills `startsWith`/`endsWith`. The `exports` map lists `"types"` last (TypeScript expects it first). Publishing uses a separate `npm/package.json` whose version is bumped independently.
- The 23 current failures:
  - 2× "Tests all expressions" coverage checks (untested: `reverse, indexOf, findIndex, splice, first, last, eqq, neqq`).
  - 12× lexer unit tests that deep-compare token structures (`sourceRef.line` now populated) — brittle tests, not engine bugs.
  - 6× dynamic-field tests + `users [sanitizer]` → B9 (they also use old function names `lowercase`/`uppercase`/`titlecase`, masked by B8).
  - `users [emails]` → uses `lowercase(...)` which no longer exists (B8).
  - `misc-debug` "It seems to f*#! this up" → B2. Note: **the test's expected value (5) is also wrong.** A direct JS translation of that template returns **10** (the template adds `$accumValue` twice: once in `"()"` and once as the `reduce` seed), and the codegen prototype also returns 10. v0 returns 4. Fix the expectation when porting.
- `archive/examples/json/*.fx.json` contain self-checking examples (`"key"` + `"key-expect"`); `test-examples.spec.ts` no longer finds them since the move. These are a good seed for the conformance corpus.

---

## 4. Design decisions (with reasoning)

### 4.1 Keep JS/TS; compile to JS source; closure backend as fallback

- V8 already is an optimizing compiler. Emitting plain JS (real locals, real arrow functions, native operators, object literals) lets V8 inline, allocate on the stack/escape-analyze, and use hidden-class-optimized object literals. Nothing a hand-rolled interpreter in JS does can compete.
- A native core cannot win when the host is JS: marshaling dominates (§3.1 reference rows). N-API object access is not cheaper than a JSON round trip in practice.
- `new Function` is unavailable under strict CSP (`unsafe-eval` blocked) and on some edge runtimes. The **closure backend** compiles the same IR into nested JS closures with slot-resolved variables — no `eval`, still far faster than v0 (expected; not measured). Later, **ahead-of-time compilation** (emit a `.js` module at build time) is a third way to avoid `eval` entirely.
- Both backends consume the same resolved/optimized IR, so semantics live in one place, and they can be **differentially tested** against each other.

### 4.2 Rewrite the front end (scanner + Pratt parser → AST)

The v0 front end mutates a single token tree through four passes plus optimizer/validator hooks. Several bugs (B5, B6, B7, B9, and the `:` key-vs-invoke hack `isNotAssignment`/`:_kv`) are structural consequences of that design. A single-pass scanner with maximal-munch operator matching, and a Pratt (precedence-climbing) parser that builds typed AST nodes directly, removes those bug classes and gives precise error positions. Custom operators are naturally supported by registering symbols with binding powers. Parse speed is irrelevant, so favor clarity.

Risk: subtle syntax differences from v0. Mitigation: the conformance corpus (§9) seeded from all existing tests, README examples, archived examples, and — ideally — real production templates from the owner (§10 Q8), with each case annotated as "v0-compatible" or "intentional change".

### 4.3 Syntax: keep `:`; define chains properly

- `.` is always property access, `:` is always function invocation (`$x:f(a)` ≡ `f($x, a)`). This static distinction is what allows functions to be resolved at compile time and avoids property/function collisions with arbitrary JSON keys (`first`, `length`, `min`, `sort`, …) and with future extension functions. Precedent: Lua `obj:method()`; UFCS in D/Nim.
- **Chain**: a primary expression followed by any sequence of postfix steps: `.name`, `?.name`, `:fn[(args)]`, `?:fn[(args)]`, `[i]`/`[i, j]`, `{k}`/`{k1, k2}` (and `?`-prefixed index/pick: `?[…]`, `?{…}`). `?` guards the step it prefixes: if the receiver at that step is `null`/`undefined`, **the whole chain** evaluates to `null`. This is JS optional-chaining semantics (with `null` instead of `undefined`, matching v0's result value).
- **Parentheses end a chain** (JS semantics, **decided**): `($a?.b).c` throws when `$a` is null. v0 returns `null` there because single-element groups are unwrapped (verified). This is an accepted v0 difference (§7, class C).
- **Prefix unary operators** (`-`, `!`, `!!`, custom unary) apply to the following *chain*: `-$.x` = `-($.x)`; `-2 ** 2` = `(-2) ** 2` = 4 (matches v0; JS would reject it, Python gives −4).
- **Readability note for docs**: `?:` is "`?` + `:`", like `?.` is "`?` + `.`"; it is not the Elvis operator.

### 4.4 Semantics

- **Lexical scoping, resolved at compile time.** Scopes: root (inputs + globals) → object scopes (`$var`, `@fn` declarations; order-independent; mutually recursive functions allowed) → lambda/function parameter scopes. Every reference resolves to a binding at compile time; unresolvable `@name` is a compile error; unresolvable `$name` is a compile error when the input names are declared (`compile(t, { inputs: ['$'] })`), otherwise it is treated as an input looked up at run time (v0-compatible default).
- **Object `$vars` are lazy and memoized per evaluation of their enclosing object** (i.e. per entry into that scope — once per template evaluation for top-level vars, once per invocation for vars inside a function body). Unused vars are never evaluated. This replaces v0's cross-evaluation cache + dependency invalidation (B15). Cyclic var dependencies are a compile error (B11); cycles through functions (recursion) are allowed.
- **User functions and lambdas are real closures** — re-entrant and recursive (B2). Parameters may be `$name` (value) or `@name` (callable), as v0 allows (`"@addValues($items, $accumValue, @valueExpr)"`).
- **Lambda argument normalization**: v0 turns `null`/`undefined` arguments into `null`. Keep (compat; it also makes `null` the only "missing" value templates see). Owner may opt out (§10 Q5).
- **`&&`, `||`, `ifElse`, `if … else`** short-circuit (B4). They return operand values like JS (`'x' || 'y'` → `'x'`), as v0 does.
- **Compiled templates are pure functions of their inputs** (plus globals and any impure functions they call). Multiple concurrent or nested evaluations are safe.
- **Output objects**: keys in declaration order (JS integer-key ordering applies, as in v0); keys whose value is `undefined` are present (as v0). Optional keys `name?` are omitted when the value is `null`/`undefined` (B10; **decided**). In v0 such a key is emitted literally as `"name?"` (verified), so this is an accepted v0 difference (§7, class C).
- **Bare words** (identifiers in value position that aren't a keyword or a registered function) evaluate to their own name as a string constant, as in v0: `"kind": "order"` → `"order"`, `ifElse($.x, yes, no)` → `"yes"`. A bare word that *is* a registered function name is a zero-argument call (v0: `math~PI`, `now`). Two consequences to document:
  - Registering a new function whose name matches a bare word used as a string changes that template's meaning. The docs recommend quoting string constants (`'order'`). `json-fx check` reports bare words, and `CompileOptions.strictIdentifiers: true` (opt-in) makes them compile errors.
  - The `:` invocation rule protects function calls, not bare words.
- **Unknown names in call position** (`name(...)`, `:name`, `:name(...)`, `?:name`) are compile errors with "did you mean" suggestions (B8). That catches the typo/renamed-function class of bugs without breaking bare-word strings.
- **Missing inputs**: if input names aren't declared at compile time, a reference to an unknown `$name` compiles to an input lookup that throws `FxRuntimeError: Undefined variable "$name"` **when evaluated** if the name wasn't supplied (`!(name in inputs)`). That matches v0, including its laziness: a reference in a branch that never runs doesn't throw. An input explicitly supplied with value `undefined` counts as present. With declared inputs (`compile(t, { inputs: ['$'] })`), unknown `$names` are compile errors.
- **Errors**: `FxSyntaxError` (parse), `FxCompileError` (resolution, unknown function, arity, cycles), `FxRuntimeError` (anything thrown during evaluation, carrying the template name and, where available, the source path).

### 4.5 Extensibility

- `FxFunctionDef` stays source-compatible with `FxExpressionDefinition` (`name`, `evaluate`, `operator`, `deferEvaluation`, `params`). New optional fields:
  - `pure?: boolean` — enables constant folding and hoisting. Default `false` for extensions; built-ins declare it (`now`, `log`, `math~random`, `throw` are impure).
  - `async?: boolean` — reserved; phase 7 (§8).
- `deferEvaluation` arguments are formalized as `FxLazyArg { evaluate(): any; readonly sourceRef: SourceRef }`. Nothing else on the v0 `FxExpression` is supported.
- Built-ins may carry an **internal** `emit` hook (inline code template, e.g. `add` → `(a + b)`). Not exposed to extensions: it is the riskiest place to admit foreign code into the generator.
- Intrinsics (`if/else`, `for/in`, `as`, chains, …) are parser constructs / IR nodes, not definitions.
- `fx.scope` is removed. Replacement: `fx.defineGlobal('$name', value)` — bound at compile time to a global slot, value read at run time from the `JsonFx` instance (so later updates are visible to already-compiled templates).
- Definition binding time is unchanged: functions are resolved when a template is compiled; `define()` after `compile()` doesn't affect existing compiled templates (same as v0).

### 4.6 Trust model and security

**Position.** json-fx evaluates template logic with the full privileges of the host process. Template authors are **trusted** in our own projects, which is the primary use case. A published general-purpose library can't assume that, so v1 (a) hardens by default where the cost is negligible and nothing legitimate breaks, and (b) states plainly in the README what it does **not** protect against. Hardening is defense in depth, not a sandbox guarantee.

**Default hardening (always on):**
1. **Prototype-path keys blocked.** Reads of `__proto__`, `constructor`, `prototype` return `undefined`. Static keys are decided at compile time; dynamic keys (`[$k]`, `{$k}`) are checked by a runtime helper.
2. **Inherited functions blocked; own function properties allowed.** A property/index read that yields a function returns `undefined` **unless** the function is an own property of the object it's read from (`Object.hasOwn(obj, key)`). So:
   - Host callbacks passed in inputs keep working, as in v0: `$.items:map($.fmt)` with `{ fmt: n => '#' + n }` → `["#1", "#2"]` (verified in v0; must stay so).
   - Inherited methods (`.constructor`, `.toString`, `Array.prototype.map`, class-instance methods) can't be read. That is what blocks the §3.3 payload, which depends on `.constructor` (inherited) twice.
   - The cost is the `hasOwn` check, paid only on the rare path where the value read is a function (`typeof t === 'function'`). Plain data reads pay a single `typeof`.
3. **Generator hygiene** (needed for correctness as much as security):
   - Every identifier in generated code is generator-made (`p3`, `v7`, `t12`, `k4`), never derived from template text.
   - Every literal and key goes through `JSON.stringify`.
   - Output keys named `__proto__` use computed-key syntax.
   - Non-JSON constants and all functions are passed in via a captured table, never serialized.
4. **Fuzzed.** The emitter is fuzzed with hostile keys and literals: quotes, backslashes, backticks, `${`, `*/`, `</script>`, U+2028/2029, `__proto__`, very long strings.

**Documented risks, i.e. what json-fx does *not* protect against.** These go in a README "Security" section:
- **Resource exhaustion.** Unbounded recursion (`@f($n)` calling itself), huge ranges (`range(0, 1e9)`), exponential string or array growth, and deep nesting can hang or crash the process. There are no time or memory limits.
- **Data exposure.** A template can read anything reachable from its inputs and globals and put it in the output.
- **Host-provided capabilities.** Any function the host registers, or passes as an own property of an input, can be called by templates with arbitrary arguments. Hosts must not expose dangerous functions (filesystem, network, `eval`-like) to template authors they don't trust.
- **Impure built-ins.** `log` writes to the console; `now`/`math~random` are non-deterministic.
- **Bugs.** Hardening reduces, but doesn't eliminate, the chance of a template reaching host code through an engine bug, especially in a code-generating engine.
- **Guidance:** for untrusted templates, evaluate in an isolated process or worker with CPU/memory limits and a minimal function set, and treat the output as untrusted data.

**Optional future hardening** (Phase 7, opt-in): recursion-depth limit, output-size limit, step budget in the closure backend, and an option to disallow function values in inputs entirely.

### 4.7 Toolchain

TypeScript 5.x (strict), **vitest** for tests, **tsup 8** for dual ESM/CJS builds (as today), ESLint + typescript-eslint (replace tslint), target ES2020 / Node ≥ 18, drop `polyfills.ts` and `lib: dom`. Single `package.json` with `files`/`exports` (`"types"` first) instead of the separate `npm/package.json`. Publish as `@mindsung/json-fx@1.0.0`.

---

## 5. v1 architecture

```
template (JSON value)
  │
  ├─ syntax/template-reader.ts   JSON value → AST   (object keys, comments, (), $var, @fn, dynamic/optional keys)
  │     └─ syntax/scanner.ts + syntax/parser.ts   string expression → AST (Pratt)
  │
  ├─ semantics/resolve.ts        scopes, bindings, unknown names, arity, cycle detection
  ├─ semantics/optimize.ts       constant folding (pure fns), dead-var elimination, simple inlining
  │
  ├─ backend/js/codegen.ts       IR → JS source → new Function      (default where eval is allowed)
  ├─ backend/closure/compile.ts  IR → nested closures               (CSP / edge fallback; reference semantics)
  └─ runtime/helpers.ts          small shared helpers (safe get, index, pick, dynamic fields, error wrapping)
```

### 5.1 Proposed source layout

```
json-fx/
  src/
    index.ts                 public exports
    api/json-fx.ts           JsonFx, compile options, CompiledTemplate
    api/types.ts             FxFunctionDef, FxLazyArg, FxInput, SourceRef, options
    errors.ts                FxError, FxSyntaxError, FxCompileError, FxRuntimeError
    syntax/scanner.ts
    syntax/parser.ts
    syntax/template-reader.ts
    syntax/ast.ts
    semantics/resolve.ts
    semantics/optimize.ts
    semantics/purity.ts
    backend/js/codegen.ts
    backend/js/emit.ts       emission primitives (identifiers, literals, keys) — the only place strings are produced
    backend/closure/compile.ts
    runtime/helpers.ts
    stdlib/*.ts              built-ins (moved from fx/functions), with pure/emit metadata
  test/
    conformance/*.json       language-agnostic cases (§9)
    conformance.test.ts      runs every case on every backend
    differential.test.ts     random templates: closure vs codegen
    security.test.ts
    syntax/*.test.ts         scanner/parser unit tests (AST snapshots)
  bench/
    fixtures/*.js            Appendix C and more
    run.ts
```

The v0 `lexer/`, `runtime/`, `model/`, `fx/def/` directories are deleted once v1 passes the corpus.

### 5.2 Lexical grammar

| Token | Rule |
|---|---|
| whitespace | skipped (`\s`) |
| identifier | `[A-Za-z_~][A-Za-z0-9_~]*` (`~` is the namespace separator: `math~round`, `crypto~md5`) |
| variable | `$` followed by identifier chars (possibly none: `$` alone is valid) |
| template name | `@` followed by identifier chars |
| number | JSON-like: `\d+(\.\d+)?([eE][+-]?\d+)?` (fixes B7). Leading `-` is the unary operator |
| string | single-quoted. Escapes: `\'` → `'`, `\\` → `\`; any other backslash is kept literally (minimizes breakage for v0 literals containing backslashes) (fixes B14) |
| keywords | `true false null undefined if else for in as` |
| punctuation | `( ) [ ] { } , =>` |
| operators | maximal munch over the **registered** operator set (built-in + extension), e.g. `?.`, `?:`, `?[`, `?{`, `**`, `===`, `!==`, `==`, `!=`, `>=`, `<=`, `&&`, `\|\|`, `!!`, `+ - * / % > < ! . :` (fixes B6: quotes are never operator characters) |

### 5.3 Expression grammar and precedence

Binding powers keep v0's relative order (v0 numbers in brackets):

| Level (loosest → tightest) | Construct | Assoc |
|---|---|---|
| 1 | lambda `params => expr` [0] — `params` = `$x` \| `@f` \| `( [p {, p}] )` | right |
| 2 | conditional `A if C else B` [0.1] (Python style; `else` branch may itself be a conditional) | right |
| 3 | comprehension `E for $x in A` [0.2] → `A:map($x => E)` | left |
| 4 | `\|\|` [1] (short-circuit) | left |
| 5 | `&&` [1.1] (short-circuit) | left |
| 6 | comparison `== === != !== > >= < <=` [2] | left |
| 7 | additive `+ -` [3] | left |
| 8 | multiplicative `* / %` [3.1] | left |
| 9 | `**` [3.2] | right |
| 10 | prefix unary `- ! !!` + custom unary — operand is a *chain* | — |
| 11 | chain: primary + postfix steps `. ?. : ?: [ ] ?[ ] { } ?{ }` [4] | left |

Custom binary operators slot in by their declared `precedence` number (map the number onto binding power; keep the numeric scale from v0 so existing extension definitions keep their meaning). Custom unary operators are prefix only (the sole postfix unary in v0 was the stray `funny` `?`, B12, which is removed).

Primary expressions: literal; `$var`; `@fn` (as a value); `@fn(args)`; `fn(args)` (registered function call; unknown `fn` → compile error); bare identifier → zero-argument call if it names a registered function (e.g. `math~PI`, `now`), otherwise a **bare-word string constant** (v0-compatible; error only with `strictIdentifiers`); `( expr )`; array literal `[a, b]`; object literal `{ key: expr, … }`.

Inline object literal keys (same set as JSON template keys, see §5.4): `ident`, `'string'`, number, `$var` (declaration), `@fn(params)` (declaration), `()` (output), `[ expr [as $v[, $k]] ]` (dynamic). Because keys are parsed in key position (not as expressions), the `:` after a key is never confused with invocation (removes v0's `isNotAssignment`/`:_kv` hack).

Postfix steps:
- `.name` / `.$name` / `.'any key'` / `.123` → constant property key (v0 treats `.$b` as the literal key `"$b"`; keep).
- `:fn` / `:fn(args)` → registered function, receiver is first argument. `:@fn` / `:@fn(args)` → user function. Parentheses optional when no further args.
- `[e]` → index; `[e1, e2, …]` → array of indexed values (v0 behavior).
- `{k}` / `{k1, k2}` → new object with just those keys (v0 "key indexer").
- `?` prefix on any step → guard (§4.3).

Removed/changed: unknown names in call position (`name(…)`, `:name`) are compile errors (B8); `(a, b)` outside parameter/argument position is a syntax error (v0 silently made an array); `as` is only valid in dynamic keys.

Note on `:name` with an unknown name: in v0, `$x:foo` where `foo` isn't a function evaluates to the string `"foo"`, dropping `$x`. No sensible template relies on that, so it becomes a compile error. This is the main B8 fix.

### 5.4 Template (JSON) reading rules

For an object template, each key is interpreted as (in order):
1. starts with `//` → comment, skipped (v0).
2. `()` → output expression; only declarations may coexist (else compile error; v0 threw this at *run* time).
3. starts with `$` → variable declaration `$name`.
4. starts with `@` → function declaration `@name` or `@name(p1, p2, …)`; parameters are `$x` or `@f`.
5. starts with `{` and ends with `}` → dynamic key: `{ source [as $v[, $k]] }`. Semantics: source array → one key per item: key = `String(item)`, `$v` = item, `$k` = index; source object → key = each own key, `$v` = value, `$k` = key; any other value → single key `String(value)`, `$v` = value. Field value expression is evaluated with those bindings (fixes B9; matches the existing tests' expectations).
6. ends with `?` → optional static key `name` (omitted when value is `null`/`undefined`). To emit a key that literally ends in `?`, write it as `"{ 'name?' }"` (a constant dynamic key).
7. otherwise → literal static key, used verbatim (no parsing).

Values: string → expression (empty string → `null`, as v0); number/boolean/null → literal; array → array of templates; object → object template.

### 5.5 AST / IR

All nodes carry `src: SourceRef` (`{ path, line, column, symbol }`; `path` is the JSON path like `lines[0].total`).

```ts
type Node =
  | { kind: 'literal'; value: string | number | boolean | null | undefined }
  | { kind: 'ref'; name: string; binding?: Binding }                 // $x, @f (value position)
  | { kind: 'array'; items: Node[] }
  | { kind: 'object'; decls: Decl[]; fields: Field[]; output?: Node; scope?: ScopeInfo }
  | { kind: 'lambda'; params: Param[]; body: Node; scope?: ScopeInfo }
  | { kind: 'call'; fn: FnRef; args: Node[] }                       // registered function (static)
  | { kind: 'apply'; callee: Node; args: Node[] }                   // @user(...) / callable param
  | { kind: 'chain'; base: Node; steps: Step[] }
  | { kind: 'unary'; op: OpRef; operand: Node }
  | { kind: 'binary'; op: OpRef; left: Node; right: Node }          // op resolved to a FnRef
  | { kind: 'logical'; op: '&&' | '||'; left: Node; right: Node }
  | { kind: 'cond'; test: Node; then: Node; else: Node }            // `if/else` and built-in ifElse
  | { kind: 'lazyCall'; fn: FnRef; args: Node[] }                   // deferEvaluation functions

type Step =
  | { kind: 'prop'; key: string; guard: boolean }
  | { kind: 'index'; keys: Node[]; multi: boolean; guard: boolean }
  | { kind: 'pick'; keys: Node[]; guard: boolean }
  | { kind: 'invoke'; fn: FnRef; args: Node[]; guard: boolean }     // :fn(args) — receiver prepended
  | { kind: 'invokeUser'; callee: Node; args: Node[]; guard: boolean };

type Decl  = { kind: 'var'; name: string; value: Node } | { kind: 'fn'; name: string; params: Param[]; body: Node };
type Field = { kind: 'static'; key: string; value: Node; optional: boolean }
           | { kind: 'dynamic'; source: Node; valueName?: string; keyName?: string; value: Node };
type Param = { name: string; callable: boolean };                    // '$x' | '@f'
type Binding = { scope: ScopeInfo; kind: 'input' | 'global' | 'var' | 'fn' | 'param'; slot: number };
```

Lowerings done in the parser/reader: `E for $x in A` → `call(map, [A, lambda])`; `ifElse(c, a, b)` with the built-in → `cond`; operators → `binary`/`unary` referencing the operator's function definition (so extension operators work uniformly).

### 5.6 Resolver

- Build `ScopeInfo` tree; collect object decls first (order-independent), then resolve all refs.
- Names: `$…`/`@…` are separate spaces only by sigil (they're distinct strings anyway).
- Var dependency graph per object scope (direct var→var references, not through functions/lambdas) → cycle = `FxCompileError` with the cycle path.
- Arity check for registered functions when `params` is declared (min = required params; rest params allowed when the function is variadic — add `variadic?: boolean` or infer from `evaluate.length` conservatively: **only warn**, never error, on `evaluate.length` mismatch).
- Unknown registered function **in call position** → `FxCompileError` with Levenshtein suggestions from the registry (main migration aid: old names like `lowercase` → "did you mean `toLowerCase`?"). Bare identifiers in value position resolve to a zero-arg call if registered, else a string constant; with `strictIdentifiers` they're errors (with suggestions). The resolver records every bare-word string it produces, so `json-fx check` can list them.
- Unresolved `$name` with undeclared inputs → binding kind `input` (lazy runtime lookup that throws if absent, §4.4). With declared inputs → `FxCompileError`.
- Mark captured bindings (needed by the closure backend for frame layout; the JS backend gets closures for free).

### 5.7 Optimizer (keep small and safe)

1. Constant-fold `call`/`binary`/`unary` of `pure` functions whose args are all literals. If folding throws, leave the node unfolded (the error then happens at run time, as it would have).
2. Vars bound to literals → inline the literal.
3. Remove unreferenced decls.
4. (Later) hoist input-independent pure subexpressions out of lambdas.

### 5.8 JS code generation rules

Factory shape:
```js
// new Function('K', 'R', 'G', body) called once at compile time:
const k0 = K[0], k1 = K[1] /* registered fns, non-JSON constants, SourceRefs */;
return function template_<name>(I) { /* I = inputs object { $: …, $other: … } */
  try { return <expr>; } catch (e) { throw R.wrap(e, <templateName>); }
}
//# sourceURL=jsonfx://<templateName>.js
```

| IR | Emitted JS |
|---|---|
| literal | `JSON.stringify(v)`; `undefined` → `undefined` |
| ref input (declared) | `I["$name"]` |
| ref input (undeclared) | `("$name" in I ? I["$name"] : R.missing("$name", k9))` (throws `FxRuntimeError`; lazy, v0-compatible) |
| ref global | `G["$name"]` |
| ref var (lazy) | `v3()` |
| ref fn / param | `f2` / `p5` |
| array | `[a, b]` |
| object without decls/dynamic fields | `{"k": a, "k2": b}`; `__proto__` → `["__proto__"]: a` |
| object with decls | `(() => { let v3_s = 0, v3_v; const v3 = () => v3_s ? v3_v : (v3_s = 1, v3_v = <expr>); const f2 = (p…) => …; return {…}; })()` — the `v3_s` state flag also detects re-entrant var cycles at run time if any slipped through (throw instead of recursing) |
| optional field | `const o = {…}; if ((x = …) != null) o["k"] = x;` |
| dynamic field | `for (const [k, v] of R.dyn(<source>)) o[k] = ((pV, pK) => <value>)(v, k)` (or `R.dynKeys` helper), keys assigned via `Object.defineProperty` when `k === "__proto__"` |
| lambda | `((p1, p2) => { p1 = p1 == null ? null : p1; …; let t…; return <body>; })` |
| call (registered) | `k4(a, b)`; built-ins with `emit` → inline (`(a + b)`, `Math.round(a)`, `a.length`, …) |
| apply | `f2(a, b)` / `p5(a, b)` (direct; no wrapper) |
| lazyCall | `k4({ evaluate: () => <a>, sourceRef: k9 }, …)` |
| logical / cond | `(a && b)`, `(a \|\| b)`, `(c ? a : b)` |
| chain | single temp `t`: `(t = <base>, t == null ? null : (t = t["b"], t = k4(t, x), t == null ? null : (t = R.get(t, k), t)))` — a `?` on step *i* inserts `t == null ? null : (` before step *i*, closed at the end |
| prop step, static key | `t = (u = t, u["k"])` then function guard: `typeof t === "function" && !Object.hasOwn(u, "k") && (t = undefined)`. One `typeof` per step on the hot path; `hasOwn` only runs when the value is a function. Blocked static keys (`__proto__`, `constructor`, `prototype`) compile to `t = undefined` |
| index/dynamic key | `t = R.get(t, key)` (denylist + same function guard) |

Temps: each emitted function body (template root, object IIFE, lambda) declares its own `let t…` list.

Inline table for built-ins (start with): `add +`, `sub -`, `mul *`, `div /`, `mod %`, `pow **`, `neg -`, `eq ==`, `eqq ===`, `neq !=`, `neqq !==`, `gt >`, `gte >=`, `lt <`, `lte <=`, `not !`, `notNot !!`, `length .length`, `math~round/floor/ceil/abs/min/max/sqrt → Math.*`, `toUpperCase/toLowerCase/trim → method call`. Inlining must preserve the built-in's exact semantics (e.g. `toString` on null throws in both).

### 5.9 Closure backend

Same IR. Each scope gets a frame (`any[]`); bindings are `(depth, slot)`; emit specialized closures for depth 0/1/2/n. Object lazy vars use a sentinel in their slot. Chains compile to a loop over a precompiled step array with an early `return null`. This backend is the **semantic reference** (simplest to read and debug) and the CSP/edge fallback.

### 5.10 Runtime helpers (`runtime/helpers.ts`)

`get(o, k)` (null → JS-like TypeError with template context; key denylist; function values only if `Object.hasOwn(o, k)`), `index(o, keys)`, `pick(o, keys)`, `dyn(source)`, `missing(name, src)` (throws `FxRuntimeError: Undefined variable`), `wrap(err, name)` (→ `FxRuntimeError`, preserving `cause`), `lazyArg(thunk, src)`.

---

## 6. Public API v1

```ts
export class JsonFx {
  constructor(...definitionSets: ReadonlyArray<FxFunctionDef>[]);   // v0-compatible
  constructor(options: JsonFxOptions);
  define(def: FxFunctionDef | ReadonlyArray<FxFunctionDef>): void;
  defineGlobal(name: `$${string}`, value: unknown): void;
  compile(template: unknown, options?: CompileOptions): FxCompiledTemplate;
}

export interface JsonFxOptions {
  functions?: ReadonlyArray<FxFunctionDef>[];
  backend?: 'auto' | 'codegen' | 'closure';      // auto = codegen if new Function works, else closure
}

export interface CompileOptions {
  name?: string;                                 // used in errors and sourceURL
  inputs?: string[];                             // declare input names → unknown $names become compile errors
  strictIdentifiers?: boolean;                   // bare words in value position → compile error (default false, v0-compatible)
  backend?: 'codegen' | 'closure';
}

export interface FxCompiledTemplate {
  run(inputs: Record<string, unknown>): any;     // pure, fast path: compiled.run({ $: data })
  evaluate(...inputs: FxInput[]): any;           // v0-compatible: inputs persist across calls (merged into a retained object)
  clearInputs(): void;                           // v0-compatible
  readonly source?: string;                      // generated JS (codegen backend), for debugging
  toString(): string;
}

export interface FxFunctionDef {
  name: string;
  evaluate: (...args: any[]) => any;
  operator?: { symbol: string; precedence: number; assoc?: 'left' | 'right'; isUnary?: boolean };
  deferEvaluation?: boolean;                     // args are FxLazyArg
  params?: FxParamDefinition[];
  pure?: boolean;
  // async?: boolean;                            // reserved (phase 7)
}

export interface FxLazyArg { evaluate(): any; readonly sourceRef: SourceRef; }
```

Later (phase 7): `compiled.toModule(): string` / CLI `json-fx build` for AOT; CLI `json-fx check <template.json>` to lint v0 templates for v1 (unknown functions with suggestions, removed syntax, behavior-change warnings).

---

## 7. Compatibility policy (v0 → v1)

v1 is **not** bug-for-bug compatible with v0, and doesn't claim to be. The policy:

1. Every behavior difference is deliberate, listed below, and placed in one of four classes.
2. Every Class B/C difference that can appear in a template is **statically detectable** by `json-fx check`.
3. A **side-by-side diff of v0 and v1** over real templates and sampled inputs is a release gate (§7.3).

### 7.1 Change classes

**Class A — no effect on templates that work today.** These only change templates that currently throw, or only change performance or how many times side-effecting functions (`log`, extension functions) are called.

| Change | Note |
|---|---|
| `?` guards the rest of the chain (B3) | Only expressions that threw |
| `&&` / `\|\|` short-circuit (B4) | Right operand no longer evaluated when not needed: fewer side effects, no throw |
| `?:` evaluates its receiver once (B1) | Fewer calls of side-effecting functions |
| Dynamic keys work (B9) | Unusable in v0 |
| Cyclic `$vars` → compile error (B11) | Overflowed the stack in v0 |
| `"()"` alongside output keys → compile-time error | Threw at run time in v0 |
| `funny` postfix `?` removed (B12); `(a, b)` group-as-array → syntax error | No legitimate use known; reported by `check` |
| Unknown function in call position (`$x:foo`, `foo(…)`) → compile error (B8) | v0 returned the string `"foo"` and dropped the arguments, never a meaningful result. It's a compile error rather than a silent change, so it can't slip through unnoticed |

**Class B — bug fixes that change the output of templates that run without error.** v0 output is wrong in these cases; anything downstream that has adapted to the wrong value is affected.

| Change | v0 → v1 example (verified v0 values) | `check` detection |
|---|---|---|
| Prefix unary applies to the whole chain (B5) | `ifElse(!$.active,'off','on')` with `active:false`: `"on"` → `"off"`; `-$.x`: `undefined` → `-5` | prefix `!`/`!!`/`-`/custom unary directly before a chain with ≥ 1 postfix step |
| String literal after an operator character (B6) | `['a','b']`: `["a",",b"]` → `["a","b"]`; `'a'+'b'`: `"a"` → `"ab"` | an operator token or `,` immediately followed by a string token (probed against v0: only operator characters mis-read a following quote; `(` and brackets are fine) |
| Exponent number literals (B7) | `1e3`: `1` → `1000` | digit immediately followed by `e`/`E` |
| Re-entrant / recursive user functions (B2) | factorial `@f(5)`: `1` → `120`; misc-debug template: `4` → `10` | any `@function` that can reach itself in the call graph, or any template passing `@functions`/lambdas into other user functions ("may be affected"); also any function passed to a user function |
| `$vars` memoized per evaluation, not across evaluations (B15) | `"$t": "now()"` is no longer frozen after the first `evaluate` | impure function (`now`, `math~random`, `log`, impure extensions) reachable from a `$var` |
| Stable `sort` with a valid comparator (B13) | order of elements with equal keys | any `sort` with a key lambda |
| `\'` and `\\` are escapes in string literals (B14) | `'a\\b'`: `a\\b` → `a\b` | literal containing `\'` or `\\` |
| `A if C1 else B if C2 else D` groups to the right (B18) | `'minor' if $a < 18 else 'senior' if $a >= 66 else 'adult'` with 16: `"adult"` → `"minor"` (v0 grouped it as `(A if C1 else B) if C2 else D`; a `TODO` in `fx/index.ts`) | an unparenthesized `A if C1 else B if C2 else D` |
| `toISOLocalDateTime` formats its first argument (N1) | v0 ignored it and formatted `Date.now()`; the offset now defaults to the host's offset at that date | any call of `toISOLocalDateTime` |
| An index or pick after another step is evaluated (N2) | `$.arr[0]`: `undefined` → first item; `$.o['x']`, `$.o{x}`, `($.o)['x']` likewise (v0 handled only a plain variable base and `:item(0)`) | an index or pick step that follows another step |

**Class C — accepted semantic changes (owner decision).** Templates that are correct today can change.

| Change | v0 → v1 example (verified v0 values) | `check` detection |
|---|---|---|
| Parentheses end a `?` chain (§4.3) | `($a?.b).c` with `$a = null`: `null` → throws | a parenthesized expression containing `?.`/`?:` followed by a postfix step |
| Optional keys `"name?"` (§5.4) | `{"nick?": "$.n"}`: key `"nick?"` → key `"nick"`, omitted when null | object key ending in `?` |

**Class D — host/API changes (affect integrating code, not templates).**

| Change | Who is affected | Mitigation |
|---|---|---|
| `fx.scope` removed → `fx.defineGlobal()` | `json-fx-sandbox`-style integrations | migration guide |
| Deferred args expose only `evaluate()` + `sourceRef` | Extensions inspecting `FxExpression` internals | migration guide |
| Runtime errors are `FxRuntimeError` (not `FxCompileError`) | Code catching `FxCompileError` around `evaluate` | migration guide |
| Inherited function values and `__proto__`/`constructor`/`prototype` reads → `undefined` | Templates reading methods off class-instance or prototype-backed inputs. **Own** function properties (host callbacks) still work | documented (§4.6) |
| `compiled.toString()` output format | Debug output only | — |

### 7.2 Kept for compatibility (explicitly unchanged)

- Bare words in value position are string constants (`"kind": "order"` → `"order"`, `ifElse($.x, yes, no)` → `"yes"`); `strictIdentifiers` is opt-in.
- Host functions passed as own properties of inputs can be called (`$.items:map($.fmt)`).
- A missing input throws `Undefined variable` at run time, lazily (only if the reference is evaluated).
- Lambda/function arguments `null`/`undefined` are normalized to `null`.
- `evaluate(...inputs)` remains stateful: inputs persist across calls. `run()` is the new pure entry point.
- Keys whose value is `undefined` are present in output objects.
- `.$b` is the literal property key `"$b"`.
- `-2 ** 2` = `4` (unary binds to the following chain, then `**`).
- `&&`/`||` return operand values (`'x' || 'y'` → `'x'`).
- Operator precedence order, `if … else`, `for … in`, `[i, j]` multi-index, `{k}` key pick, `//` comment keys, `"()"` output promotion.
- Extension definitions (`name`, `evaluate`, `operator`, `deferEvaluation`, `params`) and definition binding time.

### 7.3 Release gate: side-by-side diff

- **Harness (Phase 0):** install v0 next to v1 under an npm alias (`"json-fx-v0": "npm:@mindsung/json-fx@0.1.25"`). Then `bench/compare.ts` (or `json-fx compare`) takes a set of templates plus sample inputs, evaluates each with both engines, and reports every difference in value or error, annotated with the `check` findings for that template.
- **Gate (Phase 6):** run it over every template in our existing and upcoming projects with representative inputs. Every difference must be explained by a Class B/C finding that has been reviewed, and the template fixed or the new output accepted. **An unexplained difference is a v1 bug and blocks the release.**
- **Optional rollout aid:** a `shadow` mode a host app can enable for a period, evaluating with v1 and v0, returning v0's result, and logging differences.

## 8. Implementation plan

Each phase ends green (all tests passing) and is a reviewable unit. Rough sizes assume one focused developer/agent.

### Phase 0 — Groundwork (small)
1. Branch `v1`; tag `develop` head as `v0-final`.
2. Toolchain: TS 5, vitest, tsup 8, ESLint; remove tslint, polyfills, `lib: dom`; Node ≥ 18. Fix `exports` (`types` first). Collapse `npm/package.json` into `package.json`.
3. Create `test/conformance/` with the case format (§9) and a runner that can execute against **v0** (import the old engine from `src/` while it still exists, or from the published package) so the corpus can be validated before v1 exists.
4. Seed the corpus: port every script-level assertion from the existing specs, README examples, `archive/examples/json/*.fx.json` (`-expect` keys), and every repro from §3.2/§3.3 (marked `change: "bugfix"` with the v1 expectation). Fix the `misc-debug` expectation to 10.
5. Commit the benchmark harness (`bench/`, Appendix C fixture + 3–4 more: flat projection, string-heavy, array-heavy/nested lambdas, deep `?.` chains, recursion). Record v0 numbers in `bench/BASELINE.md`.
6. Add the v0 npm alias and the side-by-side `compare` harness (§7.3). Start collecting real templates and sample inputs from existing/upcoming projects (sanitized) into a private corpus directory (gitignored if necessary).

*Exit:* corpus runs against v0; known-bug cases are marked as expected failures for v0; `compare` runs (v1 side stubbed).

### Phase 1 — (Optional, not required for our projects) v0.2 hotfix release
Template authors are trusted in our projects (§4.6), so this phase isn't needed for us. Consider it only if B1 (exponential `?:`) is hurting a v0 deployment, or to protect third-party consumers of the published v0 package before v1 ships (with a security note in the v0 README). Small patches to the existing engine:
- Security: in `FxProperty.evaluate` and `IndexerDef`/`KeyIndexerDef`, return `undefined` for `__proto__`/`constructor`/`prototype` and for inherited function values (own function properties stay allowed, §4.6).
- B1: `NullInvokeDef` evaluates the receiver once and calls the inner function's evaluator with it.
- B4: make `and`/`or` deferred.
- B6: in the tokenizer, an opening quote always starts a new token.
Skip B2/B5 in v0 (structural; fixed by v1).

### Phase 2 — Front end (medium)
1. `errors.ts`, `api/types.ts`, `syntax/ast.ts`.
2. `syntax/scanner.ts` with operator set injected (built-in + extension operators). Unit tests.
3. `syntax/parser.ts` (Pratt) per §5.3. AST snapshot tests, including every v0 syntax form in the corpus.
4. `syntax/template-reader.ts` per §5.4.
5. Port built-ins to `stdlib/` with `pure` metadata (and `emit` for the inline table). Fix B13 (`sort`: precompute keys, comparator returns −1/0/1, stable). Remove `funny`.

*Exit:* every corpus template parses to an AST (or produces the expected syntax error).

### Phase 3 — Resolver + closure backend (medium)
1. `semantics/resolve.ts` per §5.6 (bindings, unknown names with suggestions, cycles, arity).
2. `backend/closure/compile.ts` per §5.9 + `runtime/helpers.ts` incl. security rules.
3. `api/json-fx.ts` with `run`/`evaluate`/`clearInputs`, `defineGlobal`, error wrapping.

*Exit:* full conformance corpus passes on the closure backend. Security tests pass. Benchmarks recorded.

### Phase 4 — JS codegen backend (medium)
1. `backend/js/emit.ts` (the only module that produces source text; identifiers/literals/keys) + its fuzz tests.
2. `backend/js/codegen.ts` per §5.8 (start from Appendix B, but driven by the new IR).
3. `backend: 'auto'` detection (`try { new Function('return 1')() } catch { closure }`).
4. Differential test: random template generator (grammar-driven, typed to produce mostly-valid programs) × random inputs → closure and codegen must agree (value or error class).

*Exit:* corpus passes on both backends; differential suite clean over ≥100k cases; benchmark target met (fixture ≤ 0.5 µs/eval on codegen; closure ≥ 5× faster than v0 — adjust once measured).

### Phase 5 — Optimizer & inlining (small)
§5.7 + the built-in inline table. Verify via `compiled.source` snapshots and benchmarks; the differential suite must stay clean.

### Phase 6 — Docs, migration, release (medium)
1. `json-fx check` CLI: compile each template, report compile errors (with suggestions) and every Class B/C detection rule from §7.1, plus bare-word strings (informational).
2. README rewrite: syntax reference incl. chain/`?` rules and the `:` rationale, recommendation to quote string constants, and a **Security** section with the trust model and documented risks (§4.6). Function reference generated from `stdlib` metadata. Migration guide built from §7. Changelog.
3. Port `archive/json-fx-crypto` as a smoke test of extension compatibility.
4. **Release gate (§7.3):** run `compare` over all real templates; review and resolve every difference.
5. Release `1.0.0`.

### Phase 7 — Later / optional
- AOT: `toModule()` + `json-fx build` (no `eval`, no parser at runtime).
- `async` functions (template becomes async; lambdas passed to async-aware collection functions; needs async variants of `map`/`filter`/… — separate design).
- Source maps for generated code (template positions in stack traces).
- Resource limits (recursion depth, output size, step budget).
- Worker-thread helper for multi-core batch evaluation (compile once per worker).
- Native engine track (Rust: `serde_json`/`simd-json`, closure-compiled evaluator, `rayon` parallelism, on-demand parsing of only the paths a template reads) — only for non-JS, bytes-in/bytes-out workloads; reuses the conformance corpus.

---

## 9. Testing strategy

**Conformance corpus** — language-agnostic JSON so other engines (or a future Rust core) can reuse it:
```json
{
  "name": "optional chain short-circuits through invoke",
  "template": "$a?.b:toUpperCase",
  "inputs": { "$a": null },
  "expect": null,
  "tags": ["chain", "null-conditional"],
  "v0": "differs",
  "note": "B3"
}
```
Fields: `expect` **or** `expectError: { "type": "FxCompileError", "match": "Unknown function" }`; `v0`: `"same" | "differs" | "skip"`; optional `functions` (names of test extension functions provided by the runner, e.g. a call-counting `tick`).

**Suites:** conformance × each backend; differential (closure vs codegen, random programs); security (§3.3 payload and variants: `$.__proto__`, `$['constructor']`, dynamic keys, inherited methods (`$.items.map`, `'x'.toString`, class-instance methods) passed as lambdas — while own-property host callbacks still work, output key `__proto__`, hostile strings through every literal/key position); syntax unit/snapshot tests; benchmark regression check (warn on >20% slowdown).

**Must-have regression cases** (from §3.2): B1 call-count test (12-level `?:` chain evaluates receiver once), B2 factorial + `misc-debug` (=10) + nested same-lambda calls, B3 table from §3.2, B4, B5, B6, B7, B8 call-position errors with suggestions, B9 all six dynamic-field tests, B11 cycle error, B13 stable sort, B15 `now()` var re-evaluated per run.

**Must-have compatibility cases** (§7.2; all `v0: "same"`):
- `{"kind": "order"}` → `{"kind": "order"}`; `ifElse($.x, yes, no)` → `"yes"`; `foo + 1` → `"foo1"`; with `strictIdentifiers` each is a compile error.
- `$.items:map($.fmt)` with an own-property callback → `["#1", "#2"]`.
- `$typo + 1` → throws `Undefined variable "$typo"`; `ifElse(true, 1, $typo)` → `1` (lazy).
- The §3.3 payload → no code execution (`$.constructor` reads `undefined`; the template then fails to call it).
- Class C behavior: `($a?.b).c` with `$a = null` throws; `{"nick?": "$.n"}` omits `nick` when null and emits `nick` otherwise; `"{ 'nick?' }"` emits the literal key `nick?`.

---

## 10. Open questions for the owner

1. ~~Parentheses end a chain?~~ **Decided: yes** (Class C, §7.1).
2. ~~Optional keys `"name?"`?~~ **Decided: yes**, omit when null/undefined (Class C, §7.1).
3. ~~Unknown identifiers → compile error?~~ **Decided:** only in call position. Bare words in value position stay string constants; `strictIdentifiers` is opt-in (§4.4).
4. ~~Trust model?~~ **Decided:** trusted authors in our projects. The published library hardens by default, documents the risks, and isn't a sandbox (§4.6). Phase 1 not required.
5. **Lambda argument normalization** (`undefined` → `null`): keep? *Recommendation: keep* (compat).
6. **Target runtimes:** Node only, or also browsers with strict CSP / edge workers? Determines whether the closure backend must be production-quality in 1.0 or just a reference implementation. *Recommendation: production-quality anyway* (it's the semantic reference).
7. **Dynamic key parameter order** for object sources: `$v` = value, `$k` = key (what the tests expect) rather than v0's `(key, value)`? *Recommendation: value, key* (consistent with arrays: item, index).
8. **Production template corpus:** can real templates (sanitized) be added to the conformance corpus? This is the single best protection against unintended behavior changes.
9. **Async extension functions:** is there a real need? If yes, design it in Phase 2 (affects IR and API), not Phase 7.
10. **String literal escapes:** OK with `\'` and `\\` as the only escapes (other backslashes literal)? Alternative: full JS escapes (`\n`, `\u…`) at the cost of changing more v0 literals.

---

## Appendix A — Verification snippets

All run against the published v0 build: `const { JsonFx } = require('<repo>/examples/node_modules/@mindsung/json-fx')`.

```js
const fx = new JsonFx([{ name: 'tick', evaluate: v => { calls++; return v; } }]);
let calls;

// B1: receiver evaluations for n-level ?: chain → 2^n
for (const n of [1, 2, 4, 8, 12]) { calls = 0; fx.compile('$:tick' + '?:toString'.repeat(n)).evaluate({ name: '$', value: 5 }); console.log(n, calls); }

// B2: recursion → 1 (expected 120)
fx.compile({ "@f($n)": "ifElse($n <= 1, 1, @f($n - 1) * $n)", "()": "@f($)" }).evaluate({ name: '$', value: 5 });

// B3..B8 — evaluate each with the listed inputs; see §3.2 table
// '$a?.b:toUpperCase'   {name:'$a', value:null}          → throws
// '$ != null && $.x'    {name:'$', value:null}           → throws
// '-$.x'                {name:'$', value:{x:5}}          → undefined
// "['a','b']"                                            → ["a", ",b"]
// '1e3'                                                  → 1
// '$:uppercase'         {name:'$', value:'Hello'}        → "uppercase"

// Security (§3.3) → "object"
fx.compile({ "$F": "$.constructor.constructor", "$made": "['return typeof process']:max($F)", "()": "[1]:max($made)" })
  .evaluate({ name: '$', value: {} });
```

## Appendix B — Codegen prototype (throwaway, drives off the v0 `FxExpression` tree)

Requires an **unminified** v0 bundle built with `--keep-names` (it dispatches on `constructor.name`) and accesses v0 internals (`compiled.expr`, `fx.loader.definitions`). It identifies `?:` and user-call wrapper nodes by matching evaluator source text — acceptable for a measurement, not for production. Not handled: `__proto__` output keys, security rules, error wrapping. Use it as a reference for the shape of emitted code (§5.8), not as a starting implementation.

```js
// codegen.js
const NULL_INVOKE = /\.args\[0\]\.evaluate\(\)/;

function codegen(root, inline = new Map()) {
  const K = [];  // constants and evaluator functions captured by the generated code
  let uid = 0;
  const lit = v => (typeof v === 'number' || typeof v === 'boolean' || v == null || typeof v === 'string')
    ? (v === undefined ? 'undefined' : JSON.stringify(v)) : `K[${K.push(v) - 1}]`;
  const ref = v => `K[${K.push(v) - 1}]`;

  // env: { vars: Map(name -> js expression), parent, fn: { temps: [] } }
  const lookup = (env, name) => {
    for (let e = env; e; e = e.parent) if (e.vars.has(name)) return e.vars.get(name);
    return `I[${JSON.stringify(name)}]`;
  };
  const temp = env => { const t = `t${uid++}`; env.fn.temps.push(t); return t; };
  const fnBody = (fn, expr) => fn.temps.length ? `{let ${fn.temps.join(',')};return ${expr}}` : `(${expr})`;

  function lambda(l, env) {
    const fn = { temps: [] };
    const vars = new Map();
    const params = l.varNames.map(n => { const p = `p${uid++}`; vars.set(n, p); return p; });
    const inner = { vars, parent: env, fn };
    const body = gen(l.expression, inner);
    const norm = params.map(p => `${p}=${p}==null?null:${p};`).join('');
    return `((${params.join(',')})=>{${norm}${fn.temps.length ? `let ${fn.temps.join(',')};` : ''}return ${body}})`;
  }

  function gen(e, env) {
    switch (e.constructor.name) {
      case 'FxConstant': return lit(e.value);
      case 'FxReference': return lookup(env, e.varName);
      case 'FxArray': return `[${e.items.map(i => gen(i, env)).join(',')}]`;
      case 'FxLambda': return lambda(e, env);
      case 'FxProperty': {
        const t = temp(env);
        let code = `(${t}=${gen(e.path[0].value, env)}`;
        if (e.path[0].interrupts) code += `,${t}==null?null:(${t}`;
        let closes = e.path[0].interrupts ? 1 : 0;
        for (let i = 1; i < e.path.length; i++) {
          const k = e.path[i].value;
          const key = k.constructor.name === 'FxConstant' ? `[${JSON.stringify(k.value)}]` : `[${gen(k, env)}]`;
          code += `,${t}=${t}${key}`;
          if (e.path[i].interrupts) { code += `,${t}==null?null:(${t}`; closes++; }
        }
        return code + `,${t}` + ')'.repeat(closes) + ')';
      }
      case 'FxFunction': {
        if (e.deferEvaluation && NULL_INVOKE.test(e.evaluator.toString())) {
          // x?:f(...)  -> evaluate receiver once, short-circuit on null
          const call = e.args[0];
          const t = temp(env);
          const rest = call.args.slice(1).map(a => gen(a, env));
          return `(${t}=${gen(call.args[0], env)},${t}==null?null:${callOf(call, env, [t, ...rest])})`;
        }
        return callOf(e, env, null);
      }
      case 'FxObject': return object(e, env);
      default: throw new Error('unsupported node ' + e.constructor.name);
    }
  }

  function callOf(f, env, preArgs) {
    const args = () => preArgs || f.args.map(a => gen(a, env));
    if (!f.deferEvaluation && inline.has(f.evaluator)) return inline.get(f.evaluator)(...args());
    // user-defined @fn(...) call wrapper: (lambda, ...args) => lambda(...args)
    if (!f.deferEvaluation && /^\(lambda, \.\.\.args\) =>/.test(f.evaluator.toString())) { const [l, ...r] = args(); return `${l}(${r.join(',')})`; }
    const fnRef = ref(f.evaluator);
    if (f.deferEvaluation) {
      const thunks = f.args.map(a => `{evaluate:()=>${gen(a, env)}}`);
      return `${fnRef}(${thunks.join(',')})`;
    }
    return `${fnRef}(${(preArgs || f.args.map(a => gen(a, env))).join(',')})`;
  }

  function object(o, env) {
    const fn = { temps: [] };
    const vars = new Map();
    const inner = { vars, parent: env, fn };
    const decls = [];
    for (const [name, sv] of Object.entries(o.scope.variables)) {
      const id = `v${uid++}`;
      if (sv.canCache) { vars.set(name, `${id}()`); decls.push({ id, sv, lazy: true }); }
      else { vars.set(name, id); decls.push({ id, sv, lazy: false }); }
    }
    let code = '';
    for (const d of decls) {
      const body = gen(d.sv.inner, inner);
      code += d.lazy ? `let ${d.id}_c=0,${d.id}_v;const ${d.id}=()=>${d.id}_c?${d.id}_v:(${d.id}_c=1,${d.id}_v=${body});`
                     : `const ${d.id}=${body};`;
    }
    let ret;
    if (o.output) ret = gen(o.output, inner);
    else if (o.fields.every(f => f.constructor.name === 'FxStaticField'))
      ret = `{${o.fields.map(f => `${JSON.stringify(f.key)}:${gen(f.value, inner)}`).join(',')}}`;
    else {
      code += 'const o={};';
      for (const f of o.fields) {
        if (f.constructor.name === 'FxStaticField') code += `o[${JSON.stringify(f.key)}]=${gen(f.value, inner)};`;
        else code += `for(const kv of ${ref(dynamicField)}(${gen(f.expression, inner)},${lambda(f.lambda, inner)}))o[kv.key]=kv.value;`;
      }
      ret = 'o';
    }
    const temps = fn.temps.length ? `let ${fn.temps.join(',')};` : '';
    return `(()=>{${temps}${code}return ${ret}})()`;
  }

  const fn = { temps: [] };
  const body = gen(root, { vars: new Map(), parent: null, fn });
  const src = `return (I)=>${fnBody(fn, body)}`;
  return { fn: new Function('K', src)(K), src };
}

function dynamicField(value, lambda) {
  if (value && value.constructor === Object) return Object.keys(value).map(k => ({ key: k, value: lambda(k, value[k]) }));
  if (Array.isArray(value)) return value.map((item, i) => ({ key: String(item), value: lambda(item, i) }));
  return [{ key: String(value), value: lambda(value) }];
}

function inlineTable(fx) {
  const defs = fx.loader.definitions, m = new Map();
  const bin = op => (a, b) => `(${a}${op}${b})`;
  const ops = { add: '+', sub: '-', mul: '*', div: '/', mod: '%', gt: '>', gte: '>=', lt: '<', lte: '<=' };
  for (const [name, op] of Object.entries(ops)) if (defs[`${name} [*]`]) m.set(defs[`${name} [*]`].evaluator.evaluate, bin(op));
  m.set(defs['math~round [*]'].evaluator.evaluate, a => `Math.round(${a})`);
  m.set(defs['length [*]'].evaluator.evaluate, a => `${a}.length`);
  m.set(defs['toUpperCase [*]'].evaluator.evaluate, a => `${a}.toUpperCase()`);
  return m;
}
module.exports = { codegen, inlineTable };
```

Example of emitted code for the Appendix C template (with inlining):
```js
(I)=>((()=>{let t7,t8,t9,t10,t13,t17;
  let v0_c=0,v0_v;const v0=()=>v0_c?v0_v:(v0_c=1,v0_v=0.08);                       // $taxRate
  const v1=((p3)=>{p3=p3==null?null:p3;let t4,t5;return ((t4=p3,t4=t4["qty"],t4)*(t5=p3,t5=t5["price"],t5))});  // @lineTotal
  const v2=((p6)=>{p6=p6==null?null:p6;return (Math.round(((p6*(1+v0()))*100))/100)});                          // @withTax
  return {"customer":(t7=I["$"],t7=t7["customer"],t7=t7["name"],t7).toUpperCase(),
          "city":(t8=I["$"],t8=t8["customer"],t8=t8["address"],t8==null?null:(t8,t8=t8["city"],t8)),
          "itemCount":(t9=I["$"],t9=t9["items"],t9).length,
          "lines":K[0]((t10=I["$"],t10=t10["items"],t10),((p11)=>{ … return {"sku":…,"total":v2(v1(p11))} })),
          … }})())
```

## Appendix C — Benchmark fixture and harness

```js
// fixtures.js
const template = {
  "$taxRate": 0.08,
  "@lineTotal($i)": "$i.qty * $i.price",
  "@withTax($n)": "math~round($n * (1 + $taxRate) * 100) / 100",
  "customer": "$.customer.name:toUpperCase",
  "city": "$.customer.address?.city",
  "itemCount": "$.items:length",
  "lines": "$.items:map($i => { 'sku': $i.sku, 'total': @withTax(@lineTotal($i)) })",
  "big": "$.items:filter($i => @lineTotal($i) > 50):map($i => $i.sku)",
  "subtotal": "$.items:reduce(($acc, $i) => $acc + @lineTotal($i), 0)"
};
const handWritten = (d) => {
  const taxRate = 0.08;
  const lineTotal = i => i.qty * i.price;
  const withTax = n => Math.round(n * (1 + taxRate) * 100) / 100;
  return {
    customer: d.customer.name.toUpperCase(),
    city: d.customer.address == null ? null : d.customer.address.city,
    itemCount: d.items.length,
    lines: d.items.map(i => ({ sku: i.sku, total: withTax(lineTotal(i)) })),
    big: d.items.filter(i => lineTotal(i) > 50).map(i => i.sku),
    subtotal: d.items.reduce((acc, i) => acc + lineTotal(i), 0),
  };
};
const mk = (k) => ({ customer: { name: 'cust' + k, address: k % 2 ? { city: 'X' + k } : null },
  items: Array.from({ length: 10 }, (_, j) => ({ sku: `s${k}-${j}`, qty: (j % 4) + 1, price: 5 + ((k * 7 + j * 13) % 40) })) });
const inputs = Array.from({ length: 1000 }, (_, k) => mk(k));
module.exports = { template, handWritten, inputs };
```

```js
// bench.js — warm up, then time N evaluations cycling over the 1000 inputs
const { template, handWritten, inputs } = require('./fixtures.js');
function bench(name, f, n) {
  for (let i = 0; i < 5000; i++) f(inputs[i % 1000]);
  const t = process.hrtime.bigint();
  for (let i = 0; i < n; i++) f(inputs[i % 1000]);
  const us = Number(process.hrtime.bigint() - t) / 1e3 / n;
  console.log(`${name.padEnd(28)} ${us.toFixed(2).padStart(8)} µs/eval`);
}
// v0:        bench('json-fx v0', d => compiled.evaluate({ name: '$', value: d }), 20000);
// prototype: bench('codegen', d => gen.fn({ $: d }), 200000);
// baseline:  bench('hand-written', handWritten, 200000);
```

Always assert output equality (`JSON.stringify`) against v0 / hand-written across all 1000 inputs before trusting a timing.
