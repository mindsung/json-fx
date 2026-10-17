# Migrating from 0.x to 1.0

1.0 is a rewrite (new parser, a compiler to JavaScript, and a closure-based fallback). Templates that worked in 0.x
almost always work unchanged, and run several times faster. It is **not** bug-for-bug compatible: where 0.x
produced a wrong result, 1.0 produces the right one. Every difference is listed here, and `json-fx check` finds the
affected constructs in your templates.

## 1. Check your templates

```sh
npm install --save-dev @mindsung/json-fx@1
npx json-fx check path/to/templates --functions ./your-extensions.cjs
```

- `--functions` is a CommonJS module that exports an array of your extension definitions; without it your own functions
  are reported as unknown.
- `--inputs '$,$other'` declares the input names so a misspelled `$name` is reported.
- A directory is searched for `*.template.json` (or, if there are none, `*.json` other than `*.inputs.json`).
- `--strict` makes change findings fail the run too (for CI); `--json` writes a machine-readable report.

Findings come in three kinds:

| Level | Meaning |
|---|---|
| `error` | The template doesn't compile in 1.0. Fix it. |
| `change` | The template compiles but this construct means something different from 0.x. The rule id (`B5`, `C1`, …) points to the table below. |
| `info` | Bare words (see below). |

To see what actually changed for real data, evaluate the old and the new version side by side. With 0.x installed
under an alias (`"json-fx-v0": "npm:@mindsung/json-fx@0.1.25"`), a script that runs each template and each sample input
through both and compares the results with `util.isDeepStrictEqual` is enough; the repository's `npm run compare` is
an example of one.

## 2. Behavior changes

### Fixes that change the output of templates that ran without error (Class B)

0.x output was wrong in these cases. Anything downstream that adapted to the wrong value is affected.

| Rule | Change | Example (0.x → 1.0) |
|---|---|---|
| B5 | A prefix operator applies to the whole chain after it | `ifElse(!$.active, 'off', 'on')` with `active: false`: `"on"` → `"off"`; `-$.x` with `x: 5`: `undefined` → `-5` |
| B6 | A string literal right after an operator character (including `,`) is read correctly | `['a','b']`: `["a",",b"]` → `["a","b"]`; `'a'+'b'`: `"a"` → `"ab"` |
| B7 | Exponent number literals | `1e3`: `1` → `1000` |
| B2 | User functions (`@f`) are re-entrant and recursive | factorial `@f(5)`: `1` → `120`. Reported for any `@function` that can reach itself, and for templates that pass `@functions` or lambdas to other user functions |
| B15 | Variables are computed once per evaluation, not once for ever | `"$t": "now()"` is no longer frozen after the first `evaluate`. Reported when a variable reaches an impure function (`now`, `log`, `math~random`, extension functions not marked `pure`) |
| B13 | `sort` is stable and uses a valid comparison | the order of items with equal keys changes. Reported for every `sort` with a key lambda |
| B14 | `\'` and `\\` are escapes in string literals | `'a\\b'`: `a\\b` → `a\b` |
| B18 | `A if C1 else B if C2 else D` groups to the right | `'minor' if $a < 18 else 'senior' if $a >= 66 else 'adult'` with `a = 16`: `"adult"` → `"minor"`. Add parentheses to keep the old reading |
| N1 | `toISOLocalDateTime` formats its argument | it formatted the current time and ignored its first argument; the offset defaults to the host's offset at *that date* |
| N2 | An index or pick that follows another step is evaluated | `$.arr[0]`: `undefined` → the first item; `$.o['x']`, `$.o{x}` and `($.o)['x']` likewise. Only a plain variable base (`$a[0]`) and `:item(0)` worked in 0.x |

N1 and N2 are not in the original change list: they were found while building the checker. If a template used `$.arr[0]`
and "worked", its 0.x output was `undefined`.

### Accepted semantic changes (Class C)

Correct 0.x templates that change meaning, by decision.

| Rule | Change | Example (0.x → 1.0) |
|---|---|---|
| C1 | Parentheses end a `?` chain | `($a?.b).c` with `$a = null`: `null` → throws. Move the `?` guards into one chain |
| C2 | Keys ending in `?` are optional outputs | `{"nick?": "$.n"}`: key `"nick?"` → key `"nick"`, left out when `null` or `undefined`. To keep a literal key ending in `?`, write `"{ 'nick?' }"` |

### Changes that only affect templates that failed or misbehaved (Class A)

- `?` guards the rest of the chain (0.x threw in some cases).
- `&&` and `||` short-circuit: the right operand isn't evaluated when it isn't needed (fewer calls of extension functions,
  no more errors from the unused side).
- `?:` evaluates its receiver once (0.x evaluated it repeatedly, exponentially in nested chains). It also works on `ifElse`, `catch`, `throw` and `deferEvaluation` extensions, as in 0.x; a null receiver ends the rest of the chain (0.x threw there).
- Dynamic keys (`"{ $.items as $v, $k }"`) work. For an object source `$v` is the value and `$k` the key.
- A cyclic variable reference is a compile error (it overflowed the stack).
- `"()"` next to output keys is a compile error (0.x threw when evaluating).
- A call to an unknown function (`foo(1)`, `$x:foo`) is a compile error with a suggestion (0.x returned the string `"foo"`).
- The stray postfix `?` and `(a, b)` as an array are syntax errors.
- A malformed expression is a syntax error: an unterminated string (`'abc`) or a lone operator (`+`) used to be accepted.
- Reads of `__proto__`, `constructor`, `prototype` and of *inherited* functions return `undefined` (see **Security** in the
  README). Own function properties of inputs still work.

### Kept

Bare words as string constants (`strictIdentifiers` is opt-in), host functions in inputs, lazily thrown
`Undefined variable`, `null` for `undefined` lambda arguments, `undefined` values present in output objects, `-2 ** 2`
is `4`, `&&`/`||` return operands, operator precedence, `if … else`, `for … in`, `[i, j]`, `{k}`, `//` comments, `"()"`.

## 3. API changes

| 0.x | 1.0 |
|---|---|
| `compiled.evaluate(...inputs)` | Still works (inputs persist between calls, as before). Prefer `compiled.run({ $: data })`: pure, and faster |
| `fx.scope` | Removed. `fx.defineGlobal('$name', value)` instead |
| Extension definitions (`name`, `evaluate`, `operator`, `deferEvaluation`, `params`) | Unchanged. New optional `pure: true` lets the optimizer fold calls and keeps `json-fx check` from reporting B15 |
| TypeScript names `FxExpressionDefinition`, `FxEvaluatorDefinition`, `FxOperatorDefinition`, `FxParamDefinition`, `AnyFn`, `FxInput`, `FxCompiledTemplate` | All still exported (the first four as deprecated aliases of `FxFunctionDef`, `FxOperatorDef`, `FxParamDef`). `FxDefinition`/`FxIntrinsicDefinition` and the `optimizer`/`validator`/`compiler` hooks exposed 0.x's parser internals and are gone |
| `deferEvaluation` arguments (`FxExpression`) | Now `{ evaluate(), sourceRef }` and nothing else; code that looked inside the 0.x expression objects must change |
| Errors from `evaluate` were `FxCompileError` | `FxRuntimeError` (`FxSyntaxError`/`FxCompileError` are thrown by `compile`). All extend `FxError` |
| `compiled.toString()` | Debug text; the format changed |
| Dynamic keys | `$v` is the value and `$k` the key (or index) |

New in 1.0: `compile` options (`name`, `inputs`, `strictIdentifiers`, `backend`, `optimize`), `compiled.warnings`,
`compiled.bareWords`, `compiled.source`, `fx.check()`, the `json-fx` command, and `A if C else B`, `for … in`, lambdas
with `=>`, inline object literals, optional keys, and `//` comments in templates.

## 4. Bare words

An identifier that isn't a function is a string constant (`"kind": "order"` gives `"order"`) in 0.x and in 1.0. It
works, but registering a function called `order` later would change that template's meaning. `json-fx check` lists
bare words as `info`; quote them (`"'order'"`) to make the intent explicit, or compile with `strictIdentifiers: true` to
make them errors.

## 5. Order of work

1. `json-fx check` with your `--functions`; fix every `error`.
2. Review each `change` finding against the tables above. Most are `B15` (mark deterministic extension functions
   `pure: true` and they go away) and `B13`.
3. Run your tests, or the side-by-side comparison, on representative inputs.
4. Switch callers from `evaluate` to `run` when convenient.
