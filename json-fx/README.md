# JSON-fx

**JSON-fx** is a query and transform engine for JavaScript. A *template* is a JSON value in which strings are small
expressions and objects declare variables, functions and outputs; the template is compiled once, then evaluated against
any number of inputs.

```json
{
  "$total": "$.items:map($i => $i.price * $i.qty):reduce(($a, $b) => $a + $b, 0)",
  "customer": "$.customer.name:toTitleCase",
  "total": "$total",
  "size": "'large' if $total > 100 else 'small'"
}
```

- **Fast.** Templates compile to plain JavaScript (`new Function`), which V8 optimizes like hand-written code. Where
  `eval` is unavailable (strict CSP, some edge runtimes) a closure-based backend with identical semantics takes over.
- **Small and dependency-free.** Works in Node 18+ and modern browsers; ships ESM and CommonJS builds with TypeScript types.
- **Extensible.** Add your own functions and operators; call functions the template itself defines.
- **Checkable.** `json-fx check` compiles templates ahead of time and reports errors with suggestions.

> **Upgrading from 0.x?** 1.0 is a rewrite with a few deliberate behaviour changes. Run `json-fx check` over your
> templates and read the [migration guide](https://github.com/mindsung/json-fx/blob/develop/json-fx/docs/MIGRATION.md).

## Installation

```sh
npm install @mindsung/json-fx
```

```ts
// ESM / TypeScript
import { JsonFx } from "@mindsung/json-fx";

// CommonJS
const { JsonFx } = require("@mindsung/json-fx");
```

## Quick start

```ts
const fx = new JsonFx([
  { name: "addFive", evaluate: (n: number) => n + 5 }   // optional extension functions
]);

const compiled = fx.compile({
  "@myRuntimeFunction($a, $b)": "'The answer is: ' + ($a + $b)",
  "$myVar": "'The var is: ' + @myRuntimeFunction($.someInputProp:addFive, 100)",
  "someOutputProp": "'The prop is: ' + $myVar",
  "anotherOutputProp": "'The other prop is: ' + @myRuntimeFunction($.anotherInputProp, 100)"
});

const output = compiled.run({ $: { someInputProp: 10, anotherInputProp: "hello" } });
```

`output` is

```json
{
  "someOutputProp": "The prop is: The var is: The answer is: 115",
  "anotherOutputProp": "The other prop is: The answer is: hello100"
}
```

Compile once and reuse the compiled template: compiling is the expensive step, running is cheap.

## API

```ts
class JsonFx {
  constructor(...definitionSets: FxFunctionDef[][]);   // extension functions
  constructor(options?: JsonFxOptions);
  compile(template: unknown, options?: CompileOptions): FxCompiledTemplate;
  define(def: FxFunctionDef | FxFunctionDef[]): void;  // add or replace functions
  defineGlobal(name: `$${string}`, value: unknown): void;
  check(template: unknown, options?: CheckOptions): CheckReport;
}

interface JsonFxOptions {
  functions?: FxFunctionDef[][];
  backend?: "auto" | "codegen" | "closure";   // default "auto"
  optimize?: boolean;                         // default true
}

interface CompileOptions {
  name?: string;                  // carried by errors and by the generated code's sourceURL
  inputs?: string[];              // declare the input names, e.g. ['$', '$order']
  strictIdentifiers?: boolean;    // bare words are compile errors (see below)
  backend?: "codegen" | "closure";
  optimize?: boolean;
}

interface FxCompiledTemplate {
  run(inputs: Record<string, unknown>): any;     // pure; nothing is kept between calls
  evaluate(...inputs: { name: string; value: any }[]): any;   // 0.x style; inputs persist between calls
  clearInputs(): void;
  readonly warnings: FxWarning[];
  readonly bareWords: BareWord[];
  readonly source?: string;                      // the generated JavaScript (codegen backend)
}
```

### Inputs

A template reads its inputs as variables whose names start with `$`. The usual single input is named `$` itself:

```ts
compiled.run({ $: order });                                   // "$.customer.name"
compiled.run({ $: order, $rates: rates, $locale: "en-US" });  // "$.total * $rates.eur"
```

A reference to an input that was not supplied throws `Undefined variable "$name"` when (and only when) it is evaluated.
Pass `inputs: ['$', '$rates']` to `compile` to declare the names: any other `$name` is then a *compile* error, which
catches typos early.

`evaluate()` is the 0.x entry point, kept for compatibility: `compiled.evaluate({ name: "$", value: order })`. Its inputs
persist between calls (until `clearInputs()`), so prefer `run`.

### Globals

`fx.defineGlobal("$config", value)` makes `$config` available to every template compiled afterwards, without passing it
to each `run`. The name is bound when the template is compiled; the value is read on each run, so later calls to
`defineGlobal` are seen by templates that are already compiled.

### Errors

All errors extend `FxError` and carry the template position (`sourceRef`: JSON path, line and column within the
expression).

| Class | Thrown | For |
|---|---|---|
| `FxSyntaxError` | `compile` | The expression text is not valid |
| `FxCompileError` | `compile` | Unknown function (with a "did you mean"), wrong arity, cyclic variables, `"()"` mixed with output keys, … |
| `FxRuntimeError` | `run` | Anything that goes wrong while evaluating, with the path of the field being computed; the original error is the `cause` |

### Backends

`"auto"` (the default) uses the code generator when `new Function` works and the closure backend otherwise. Both produce
the same results and the same errors. Choose `"closure"` explicitly if you never want generated code, or `"codegen"` to
fail loudly when it's unavailable. `compiled.source` shows the generated JavaScript, which is handy when debugging.

## Template syntax

A template is any JSON value. A **string** is an expression, an **object** is an *object template* (variables,
functions, outputs), an **array** is an array of templates, and numbers, booleans and `null` are themselves. (Wrap a
string in an expression to get a constant string: `"'hello'"`.)

### Expressions

```
literals     1   1.5   1e3   'text'   true   false   null   undefined   [1, 'a', $x]   { a: 1, b: $x }
variables    $   $order   $item        (a name made of letters, digits and _, after a $)
property     $.customer.name   $.'odd key'   $.items.length
call         add($a, $b)   math~floor($x)   now()
chain        $a:add($b):toString          ($a:add($b) is add($a, $b))
index        $.items[0]   $.row[1, 2]    (several indexes give an array)
pick         $.user{name, email}         (a new object with just those keys)
lambda       $x => $x * 2   ($a, $b) => $a + $b
condition    'adult' if $age >= 18 else 'minor'
comprehension  $x * 2 for $x in $.items      (same as $.items:map($x => $x * 2))
operators    + - * / %  **  == === != !== < <= > >=  && ||  !  !!  -x
```

**String literals** use single quotes. `\'` and `\\` are the only escapes; any other backslash is kept as is.

**Functions.** `name(a, b)` calls a function. `a:name(b)` passes `a` as the first argument, so calls read left to right:
`$.name:trim:toUpperCase` instead of `toUpperCase(trim($.name))`. Parentheses are optional when there are no further
arguments. Operators are functions too (`$a + $b` is `add($a, $b)`). The
[function reference](https://github.com/mindsung/json-fx/blob/develop/json-fx/docs/FUNCTIONS.md) lists every built-in.

**Why `:` and not `.`?** `.` is always property access and `:` is always a function call. Because the two never mix,
data with keys called `first`, `length`, `min` or `sort` can't collide with functions of the same name, and a function
added later can't change what an existing property read means. The same distinction lets unknown functions be reported
at compile time.

**Null-conditional `?`.** Put `?` in front of a step (`?.`, `?:`, `?[`, `?{`) to stop the *whole chain* with `null` when
the value so far is `null` or `undefined`:

```
$.customer?.address?.city?:toUpperCase      // null if customer or address is missing
```

`?:` works with every function, including the lazy ones: `$.rate?:ifElse('fast', 'slow')` is `null` when `$.rate` is missing. Without `?`, reading a property of a missing value throws. (`?:` is `?` followed by `:`, like `?.`. It is not the Elvis
operator.)

**Parentheses end a chain.** `($.a?.b).c` is `.c` applied to the *result* of `($.a?.b)`, so it throws when `$.a` is
missing, as in JavaScript. Put the `?` guards inside one chain.

**Prefix operators** (`-`, `!`, `!!`) apply to the whole chain after them: `-$.x` is `-($.x)`, and `!$.items:length` is
`!($.items:length)`.

**Precedence**, loosest to tightest: lambda `=>`; `A if C else B` (the `else` branch may be another condition, so
`'minor' if $a < 18 else 'senior' if $a >= 66 else 'adult'` reads as you'd expect); `for … in`; `||`; `&&`; comparisons;
`+ -`; `* / %`; `**` (right-associative); prefix operators; chains.

`&&`, `||` and conditions only evaluate the operand they need, and return the operand's value (`'x' || 'y'` is `'x'`).

**Lambdas.** Functions that take a function (`map`, `filter`, `find`, `sort`, `reduce`, …) accept a lambda. Parameters
start with `$`; parentheses are required for zero or several parameters. `null` and `undefined` arguments reach the
lambda as `null`. A lambda sees every variable around it.

```
$.items:filter($i => $i.active):map($i => $i.id)
$.rows:reduce(($sum, $r) => $sum + $r.amount, 0)
```

**Bare words.** An identifier that is not a keyword or a function is a string constant: `ifElse($.x, yes, no)` returns
`"yes"` or `"no"`. This is kept from 0.x, but it is fragile (a function added later with the same name changes the
meaning), so **write string constants in quotes** (`'yes'`). `compiled.bareWords` and `json-fx check` list them, and
`strictIdentifiers: true` makes them errors.

### Object templates

Every property of an object template is one of the following; everything else is copied to the output.

| Key | Meaning |
|---|---|
| `"name"` | An output property. The value is a constant, an expression string, or a nested template |
| `"$var"` | A variable, usable by every other expression in this object and the objects inside it |
| `"@fn($a, $b)"` | A function declared by the template |
| `"()"` | The single output of this object: the object evaluates to this value instead of to an object |
| `"name?"` | An optional output `name`: left out when its value is `null` or `undefined` |
| `"{ source as $v, $k }"` | Dynamic keys (below) |
| `"// …"` | A comment; ignored |

```json
{
  "// how many days a project runs": "",
  "$day": 86400000,
  "@days($project)": "(($project.end - $project.start) / $day):math~round",
  "projects": "$.projects:map($p => { name: $p.name, days: @days($p) })",
  "nickname?": "$.nickname"
}
```

**Variables** are computed lazily and at most once per evaluation (once per call, for variables inside a function). An
unused variable is never computed. They may be declared in any order and may refer to each other, but not in a cycle
(a compile error).

**Functions** are real functions: they may call themselves (`"@fact($n)": "1 if $n <= 1 else $n * @fact($n - 1)"`) or
each other. A parameter named `@f` instead of `$f` takes a function, which you pass as `@name` or as a lambda. A
function name used as a value is written with its `@`: `$numbers:find(@isBig)`.

**Output promotion.** When an object has a `"()"` key, the object *is* that value; only variable and function
declarations may sit beside it.

```json
{
  "$pi": 3.14159,
  "@area($r)": "$pi * $r:pow(2)",
  "()": "@area($)"
}
```
With input `$` = `3` this yields the number `28.27431`, not an object.

**Dynamic keys** build properties from data. `"{ source as $v, $k }"` produces one property for each item of an array
(key = the item as a string, `$v` the item, `$k` the index) or for each entry of an object (key = the key, `$v` the
value, `$k` the key):

```json
{ "{$.prices as $p, $i}": "$p * 2" }
```

**Scope.** A variable or function belongs to the object that declares it and to every object nested in it, wherever
the declaration appears in the object.

Expression strings may also contain object literals, `{ a: $x, 'b c': 1 }`, with the same key rules.

### Built-in functions

About 110 functions and operators for arithmetic, comparison, logic, strings, arrays and objects, dates and the whole
`Math` library (`math~floor`, `math~PI`, …). See the generated
[function reference](https://github.com/mindsung/json-fx/blob/develop/json-fx/docs/FUNCTIONS.md).

## Extending JSON-fx

An extension is an object with at least a `name` and an `evaluate` function:

```ts
const fx = new JsonFx([
  { name: "double", pure: true, evaluate: (n: number) => n * 2 },
  { name: "crypto~md5", evaluate: (s: string) => md5(s) }          // `~` namespaces a name
]);
// "$.price:double", "crypto~md5($.id)"
```

| Property | |
|---|---|
| `name` | Function name used in templates. Letters, digits, `_` and `~` |
| `evaluate` | The implementation; receives the evaluated arguments (the receiver of a `:` call comes first) |
| `pure` | `true` if the result depends only on the arguments and the call has no side effects. Pure calls on literal arguments are computed at compile time, and `json-fx check` treats them as deterministic. Default `false` |
| `operator` | `{ symbol, precedence, assoc?, isUnary? }` makes the function an operator. Precedence uses the built-in scale: `||` 1, `&&` 1.1, comparisons 2, `+ -` 3, `* / %` 3.1, `**` 3.2 |
| `deferEvaluation` | Arguments arrive as `{ evaluate(), sourceRef }` and are evaluated only if the function asks (this is how `ifElse` and `catch` work) |
| `params` | Optional parameter names and types, for tooling |

Functions are looked up when a template is *compiled*; `define()` after that doesn't change templates already compiled.
A function that takes a function argument receives an ordinary JavaScript function for a lambda or `@name`.

## Checking templates: `json-fx check`

```sh
npx json-fx check templates/            # a file, or a directory searched for *.template.json / *.json
npx json-fx check order.template.json --functions ./extensions.cjs --inputs '$,$rates'
```

It compiles each template and reports errors with suggestions (`Unknown function 'toUppercase'. Did you mean
'toUpperCase'?`), warnings, bare words, and — when you are upgrading from 0.x — every construct whose meaning changed
(see the migration guide). Options: `--functions <module>` (a CommonJS module exporting an array of definitions),
`--inputs`, `--globals`, `--strict-identifiers`, `--strict` (exit 1 on change findings too), `--quiet`, `--json`.
From code, `fx.check(template)` returns the same report.

## Security

JSON-fx evaluates template logic with the full privileges of your process. Its primary use is templates written by the
people who run the application. It hardens by default where that costs nothing, but **it is not a sandbox**.

**Always on:**

- Reading `__proto__`, `constructor` or `prototype` yields `undefined`, however the key is spelled (`.constructor`,
  `['constructor']`, a computed key).
- A property read that would return a function returns `undefined` unless the function is an *own* property of that
  object. Host callbacks passed in the inputs keep working (`$.items:map($.format)`); inherited methods such as
  `.constructor`, `.toString` or `Array.prototype.map` can't be reached.
- The code generator never builds code from template text: identifiers are generated, literals and keys go through
  `JSON.stringify`, and functions are passed in by reference rather than serialized. It is fuzzed with hostile keys and
  literals.

**Not protected against:**

- **Resource exhaustion.** Unbounded recursion, `range(0, 1e9)`, exponential string or array growth and very deep
  nesting can hang or crash the process. There are no time or memory limits.
- **Data exposure.** A template can read anything reachable from its inputs and globals and put it in its output.
- **Host capabilities.** Every function you register, and every function you pass as an own property of an input, can be
  called with arbitrary arguments. Never expose file system, network, `eval`-like or other dangerous functions to
  templates you don't trust.
- **Impure built-ins.** `log` writes to the console; `now` and `math~random` are non-deterministic.
- **Bugs.** Hardening reduces the chance of a template reaching host code through a defect in the engine, especially in
  a code-generating engine, but can't remove it.

For templates from untrusted sources, evaluate in an isolated process or worker with CPU and memory limits and a
minimal set of functions, and treat the output as untrusted data.

## Performance

Compiled templates run several times to hundreds of times faster than 0.x. On real production templates the measured
speed-up of the default backend over 0.x is 2.3× to 9.6× per evaluation, and compiling a 955 KB template takes 280 ms
instead of 5.9 s (0.x, including its cold start); on synthetic fixtures it is 2.7× to 360×. (`npm run bench` and `npm run compare` in the repository
reproduce these.) Compile once, reuse the compiled template, and prefer `run` over `evaluate`.

## License

MIT
