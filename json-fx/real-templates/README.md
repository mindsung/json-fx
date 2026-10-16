# Real templates for the v0/v1 side-by-side gate

Put **sanitized** templates and sample inputs from existing and upcoming projects here. `npm run compare` evaluates each
with v0 and v1 and reports every difference (V1-PLAN.md §7.3). An unexplained difference is a v1 bug and blocks the release.

Either layout works (both can be mixed):

- flat: `NAME.template.json` (any JSON; a string is a single expression) and optionally `NAME.inputs.json` (one inputs
  object such as `{ "$": { ... }, "$other": 1 }`, or an array of such objects);
- one directory per template: `NAME/NAME.template.json`, sample documents in `NAME/inputs/*.json` (each one is
  evaluated as the `$` input), and optionally `NAME/NAME.inputs.json` as above.

If the templates use project-specific extension functions, pass a CommonJS module exporting an array of definitions:

```sh
npm run compare -- real-templates --functions ./path/to/extensions.js
```

Everything in this directory except this README and `.gitignore` is git-ignored so real data can't be committed by accident.
Use `git add -f` for any file you deliberately want in the repo. A runnable sample lives in `bench/compare-sample/`
(`npm run compare -- bench/compare-sample`).
