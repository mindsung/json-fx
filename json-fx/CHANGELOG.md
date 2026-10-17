# Changelog

## 1.0.2

Documentation only; no change to the library.

### Added
- [Guide](docs/GUIDE.md): a step-by-step introduction to the template language, with verified examples.
- README: an example with input and output, what JSON-fx is for and when it is not a fit, and a prominent link to the
  guide. The repository's root README is now a standalone landing page.

### Changed
- American spelling throughout the documentation (for example "Behavior changes" in the migration guide).

## 1.0.1

### Fixed
- `?:` on a deferred-evaluation function (`ifElse`, `catch`, `throw`, extensions with `deferEvaluation`) was a compile error
  in 1.0.0; 0.x accepted it. `R?:ifElse(a, b)` is `null` when `R` is `null` or `undefined`, otherwise `ifElse(R, a, b)`
  with `R` evaluated once; as with every other `?` step, a null receiver also ends the rest of the chain
  (`R?:ifElse(a, b):toUpperCase` is `null`, where 0.x threw).

## 1.0.0

A rewrite of the engine. See the [migration guide](docs/MIGRATION.md) for every behavior change.

### Added
- A compiler from templates to JavaScript (`new Function`), with a closure-based backend of identical semantics for
  environments without `eval`; `backend: "auto" | "codegen" | "closure"`.
- An optimizer: constant folding of pure functions, inlining of literal variables, removal of unused declarations.
- `compiled.run(inputs)`, a pure entry point; `compile` options `name`, `inputs`, `strictIdentifiers`, `backend`, `optimize`;
  `compiled.warnings`, `compiled.bareWords`, `compiled.source`.
- `fx.defineGlobal`, `fx.define`, `fx.check`.
- `json-fx check`: compile errors with suggestions, every construct whose meaning changed since 0.x, bare words.
- `pure` on function definitions.
- Syntax: `A if C else B`, `E for $x in A`, `=>` lambdas, inline object literals, optional keys (`"name?"`), dynamic keys,
  `//` comments, exponent literals, `\'` and `\\` escapes.
- Typed errors with template position: `FxSyntaxError`, `FxCompileError`, `FxRuntimeError`.
- Generated function reference (`docs/FUNCTIONS.md`).

### Changed
- 2.3×–9.6× faster per evaluation on real production templates (up to 360× on synthetic ones), and compiles large
  templates much faster (a 955 KB template: 280 ms instead of 5.9 s).
- Bug fixes that change output (prefix operators, string literals after operators, exponents, recursion, memoization of
  variables, `sort`, `if … else if`, `toISOLocalDateTime`, indexing after a property): see the migration guide.
- Parentheses end a null-conditional chain; keys ending in `?` are optional outputs.
- Prototype-path keys and inherited functions can't be read from templates.
- Errors raised while evaluating are `FxRuntimeError`.
- Requires Node 18 or later; ships ESM and CommonJS builds.

### Removed
- `fx.scope` (use `defineGlobal`), the stray postfix `?`, `(a, b)` as an array, silent acceptance of malformed expressions,
  unknown function names evaluating to strings.
