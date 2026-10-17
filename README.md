# JSON-fx

**JSON-fx** is a query and transform engine for JavaScript. You describe how to reshape data as a **template**, which is
plain JSON in which strings are small expressions, then compile it once and run it against any number of inputs.
Because templates are data, they can live in files or a database and be changed without redeploying your code.

**[📖 New to JSON-fx? Read the guide](https://github.com/mindsung/json-fx/blob/develop/json-fx/docs/GUIDE.md)** ·
[Full documentation](https://github.com/mindsung/json-fx/tree/develop/json-fx) ·
[Function reference](https://github.com/mindsung/json-fx/blob/develop/json-fx/docs/FUNCTIONS.md) ·
[npm](https://www.npmjs.com/package/@mindsung/json-fx)

```sh
npm install @mindsung/json-fx
```

## What it looks like

Template:

```json
{
  "$total": "$.items:reduce(($sum, $i) => $sum + $i.price * $i.qty, 0)",
  "customer": "$.customer.name:toTitleCase",
  "total": "$total",
  "size": "'large' if $total > 100 else 'small'",
  "email?": "$.customer.email"
}
```

Input:

```json
{
  "customer": { "name": "ada lovelace" },
  "items": [{ "price": 40, "qty": 2 }, { "price": 15, "qty": 2 }]
}
```

Output (`email` is left out because the input has none):

```json
{ "customer": "Ada Lovelace", "total": 110, "size": "large" }
```

```ts
import { JsonFx } from "@mindsung/json-fx";

const compiled = new JsonFx().compile(template);   // compile once…
const output = compiled.run({ $: input });         // …run as often as you like
```

## What it's for

- **Reshaping JSON**: mapping an API response or database record into the shape another system expects.
- **Calculated fields**: totals, conditions, string and date formatting, defined once in a template.
- **Configuration-driven logic**: report definitions, import/export mappings and rules that people maintain as JSON
  rather than code.
- **Filtering and querying**: `map`, `filter`, `find`, `sort`, `reduce` and about 110 other built-in functions.

A good fit when templates are written by you or people you trust and the work is data in, data out. Not a fit for
untrusted templates (JSON-fx is not a sandbox), for asynchronous work, or where plain JavaScript would do.

## Why JSON-fx

- **Fast.** Templates compile to plain JavaScript, with a closure-based fallback for environments without `eval`.
- **Small and dependency-free.** Node 18+ and modern browsers; ESM and CommonJS builds with TypeScript types.
- **Extensible.** Add your own functions and operators; define functions inside the template itself.
- **Checkable.** `json-fx check` compiles templates ahead of time and reports errors with suggestions.

Upgrading from 0.x? See the [migration guide](https://github.com/mindsung/json-fx/blob/develop/json-fx/docs/MIGRATION.md).

## License

MIT
