# JSON-fx guide

A step-by-step introduction to the JSON-fx template language. It assumes you know JSON and a little JavaScript, and
nothing about JSON-fx. Every example here was run, and the results shown are what it produced.

- New here? Read it top to bottom; each section builds on the last.
- Looking something up? Use the [README](../README.md) for the API, extensions, security and the `json-fx check` tool,
  the [function reference](FUNCTIONS.md) for the built-in functions, and the [syntax summary](#syntax-summary) at the
  end of this guide.
- Coming from 0.x? The syntax is largely the same; see the [migration guide](MIGRATION.md).

**Contents**
[The idea](#the-idea) ·
[1. Your first expression](#1-your-first-expression) ·
[2. Functions and chaining](#2-functions-and-chaining) ·
[3. Properties and indexes](#3-properties-and-indexes) ·
[4. Missing data: the null-conditional `?`](#4-missing-data-the-null-conditional-) ·
[5. Conditions](#5-conditions) ·
[6. Lambdas and collections](#6-lambdas-and-collections) ·
[7. Object templates](#7-object-templates) ·
[8. Variables](#8-variables) ·
[9. Functions you define](#9-functions-you-define) ·
[10. Output promotion](#10-output-promotion-) ·
[11. Optional keys, dynamic keys and comments](#11-optional-keys-dynamic-keys-and-comments) ·
[12. A complete example](#12-a-complete-example) ·
[Errors](#when-something-goes-wrong) ·
[Syntax summary](#syntax-summary)

## The idea

A **template** is a JSON value that describes how to turn some input data into output data. You compile it once and
run it against as many inputs as you like.

```ts
import { JsonFx } from "@mindsung/json-fx";

const fx = new JsonFx();
const compiled = fx.compile({ total: "$.price * $.qty" });   // compile once…

compiled.run({ $: { price: 4.5, qty: 3 } });                 // → { total: 13.5 }
compiled.run({ $: { price: 10, qty: 2 } });                  // → { total: 20 }   …run many times
```

Two rules cover most of the language:

1. In a template, **a string is an expression**. `"$.price * $.qty"` is computed, not copied.
2. **An object is an *object template***: its keys are either outputs or declarations of variables and functions.
   Numbers, booleans, `null` and arrays of those are copied through unchanged.

The input is passed to `run` as an object whose keys are the **input names**. The usual single input is called `$`,
so `$.price` means "the `price` property of the input". You can pass several (`{ $: order, $rates: rates }`), and
[section 8](#8-variables) shows more about names that start with `$`.

For the rest of this guide, examples show the template, then the input, then the result. A bare string such as
`"$.price * $.qty"` means a template that is just that one expression.

## 1. Your first expression

An expression computes one value. It can contain numbers, strings, booleans, `null`, `undefined`, arrays, and
references to the input.

```
$.price * $.qty                          input $ = { price: 4.5, qty: 3 }       →  13.5
'Hello, ' + $.name                       input $ = { name: 'Ada' }              →  "Hello, Ada"
```

**Strings use single quotes**, because the expression is itself inside a JSON string. Inside a string literal, `\'`
is a quote and `\\` a backslash; any other backslash is kept as is:

```
'it\'s'                                  →  "it's"
```

(Examples show the expression text. In a `.json` file the backslash must itself be escaped: `"'it\\'s'"`.)

Other literals are what you would expect: `1.5`, `1e3`, `true`, `false`, `null`, `undefined` and arrays like
`['hello', 2, true, null]`. The usual arithmetic, comparison and logic operators work:

```
+  -  *  /  %  **       == === != !== < <= > >=       &&  ||  !
```

`&&` and `||` evaluate only the operand they need and return that operand's value, as in JavaScript:
`$.nick || 'anonymous'` is `'anonymous'` when there is no `nick`.

> **A string that is meant to be a constant.** Because every string is an expression, a constant string needs its own
> quotes inside the JSON string: `"'draft'"`. Written without them, `"draft"` is a *bare word* (see
> [Bare words](#bare-words)), which works but is fragile.

## 2. Functions and chaining

JSON-fx has about 110 built-in functions for text, numbers, dates, arrays and objects (the
[function reference](FUNCTIONS.md) lists them all). You can call one the usual way:

```
toUpperCase(trim($.name))                input $ = { name: '  ada ' }           →  "ADA"
```

or **chain** with `:`, which passes the value on the left as the first argument. That reads left to right instead of
inside out:

```
$.name:trim:toUpperCase                  →  "ADA"
```

`a:add(b)` is exactly `add(a, b)`, and parentheses can be left off when there are no further arguments:
`$.a:add($.b):toString` with `{ a: 1, b: 2 }` gives `"3"`.

**Operators are functions too.** `$.a + $.b` is the same as `add($.a, $.b)`. That is why operators and functions can be
mixed freely, and why [extensions](../README.md#extending-json-fx) can add new ones.

**Why `:` and not `.`?** `.` is always a property read and `:` is always a function call. Because they never mix, a data
key called `length`, `first`, `min` or `sort` can't clash with a function of the same name, and a function added in a
future version can't change what an existing property read means. It also lets unknown function names be reported when
the template is compiled, with a suggestion:

```
toUppercase($.x)      →  FxCompileError: Unknown function 'toUppercase'. Did you mean 'toUpperCase', 'toLowerCase'?
```

Namespaced functions use `~`, for example `math~floor($.x)`, and the whole `Math` library is available as
`math~name`.

## 3. Properties and indexes

Read properties with `.`, as in JavaScript:

```
$.customer.address.city                  →  "paris"
$.items.length                           →  2
$.'odd key'                              (quote a key that isn't a simple name)
```

Index arrays with `[ ]`. Give several indexes to get an array of results:

```
$.items[0].sku                           →  "A1"
$.row[1, 2]                              input $ = { row: ['a', 'b', 'c'] }     →  ["b", "c"]
```

**Pick** keys from an object into a new object with `{ }` after it:

```
$.user{name, email}                      input $ = { user: { name: 'Ada', email: 'a@x.io', pw: '…' } }
                                         →  { "name": "Ada", "email": "a@x.io" }
```

You can also write an **object literal** inside an expression:

```
{ a: $.x, 'b c': 1 }                     input $ = { x: 5 }                     →  { "a": 5, "b c": 1 }
```

**Several inputs.** Names other than `$` are just more inputs:

```
$.total * $rates.eur                     inputs $ = { total: 100 }, $rates = { eur: 0.9 }    →  90
```

Reading an input that wasn't supplied throws `Undefined variable "$name"`. Pass `inputs: ['$', '$rates']` to
`compile` to have a mistyped name caught when the template is compiled instead.

## 4. Missing data: the null-conditional `?`

Reading a property of something that doesn't exist throws, as in JavaScript (`$.a.b` with `$ = {}` fails with
`Cannot read properties of undefined`). Real data is often incomplete, so put a `?` in front of a step to say "if what I
have so far is `null` or `undefined`, stop and give `null`":

```
$.customer?.address?.city?:toUpperCase
    input $ = { customer: { address: { city: 'paris' } } }   →  "PARIS"
    input $ = {}                                             →  null
```

`?` can precede any step: `?.` (property), `?:` (function), `?[` (index) and `?{` (pick). It stops **the whole rest of
the chain**, so one `?` early on is enough to skip everything after it. `?:` works with every function, including
lazy ones like `ifElse`: `$.rate?:ifElse('fast', 'slow')` is `null` when there is no `rate`.

**Parentheses end a chain.** `($.a?.b).c` applies `.c` to the *result* of `($.a?.b)`, so it throws when `$.a` is
missing, as in JavaScript. Put the `?` guards inside one chain.

For a fallback value instead of `null`, use `||` (`$.nick || 'anonymous'`), `ifNullOrUndefined`, or `catch`, which
returns a default if evaluating its first argument throws: `catch($.a.b.c, 'n/a')`.

## 5. Conditions

```
'adult' if $.age >= 18 else 'minor'             →  "adult"   when age is 30
```

Only the chosen branch is evaluated. The `else` branch can be another condition, which reads like an `else if`:

```
'minor' if $.age < 18 else 'senior' if $.age >= 66 else 'adult'     →  "senior"   when age is 70
```

This is the same as the function `ifElse($.age >= 18, 'adult', 'minor')`, which is still available.

## 6. Lambdas and collections

Many functions take a function as an argument (`map`, `filter`, `find`, `sort`, `reduce`, …). Pass a **lambda**:
parameter names start with `$`, then `=>`, then an expression. With one parameter the parentheses are optional; with
none or several they are required.

```
[2, 4, 6, 8]:find(($n) => $n > 5)                                      →  6
$.items:filter($i => $i.price > 10):map($i => $i.sku)                   →  ["B2"]
$.items:reduce(($sum, $i) => $sum + $i.price * $i.qty, 0)               →  39
$.items:sort($i => $i.price):map($i => $i.sku)                          →  ["A1", "B2"]
```

(The inputs for these are `$.items = [{ sku: 'A1', price: 4.5, qty: 2 }, { sku: 'B2', price: 30, qty: 1 }]`.) A lambda
can see everything around it, including the input: `$.items:map($i => $i.price * $.taxRate)`.

A **comprehension** is shorthand for `map`:

```
$x * 2 for $x in $.items                  input $ = { items: [1, 2, 3] }     →  [2, 4, 6]
```

is the same as `$.items:map($x => $x * 2)`.

## 7. Object templates

When the template is an object, each property is an output (copied to the result, with its value evaluated) unless its
name has a special form, which you'll meet in the next sections. A value can be a constant, an expression string, or a
nested object template:

```json
{
  "someProp": "$ + 1",
  "anotherProp": { "deeperProp": "$ * 2" }
}
```

With `$ = 5` that gives `{ "someProp": 6, "anotherProp": { "deeperProp": 10 } }`.

Non-string values are copied: `{ "version": 2, "enabled": true, "tags": ["a", "b"], "label": "'draft'" }` yields
`version`, `enabled` and `tags` unchanged, and `label` as the string `draft`.

## 8. Variables

A property whose name starts with `$` is a **variable**: it isn't in the output, but every other expression in the same
object (and in objects nested in it) can use it.

```json
{
  "$pi": 3.14159,
  "$radiusSquared": "$radius * $radius",
  "radius": "$radius",
  "area": "($pi * $radiusSquared * 100):math~round / 100"
}
```

With the input `$radius = 3` the result is `{ "radius": 3, "area": 28.27 }`.

- Variables are computed **lazily and at most once** per run; one that nothing uses is never computed.
- The order they're declared in doesn't matter, and they may refer to each other, but not in a cycle (a compile error).
- A variable belongs to the object that declares it and every object nested inside it, so a variable declared at the
  top of a template is available everywhere.

## 9. Functions you define

A property named `@name($a, $b)` declares a **function** inside the template. That lets you reuse logic without
extending the library or redeploying code. Call it with its `@`:

```json
{
  "@rectArea($length, $width)": "$length * $width",
  "area": "@rectArea($.length, $.width)"
}
```

With `$ = { length: 3, width: 4 }` the result is `{ "area": 12 }`.

- They can **call themselves** or each other: `"@fact($n)": "1 if $n <= 1 else $n * @fact($n - 1)"`, and then
  `@fact(5)` is `120`.
- They have the same scope as variables, so they can be declared anywhere in the object (even after use):

  ```json
  {
    "rectInfo": { "area": "@rectArea($.length, $.width)" },
    "@rectArea($length, $width)": "$length * $width"
  }
  ```

  gives `{ "rectInfo": { "area": 12 } }`.
- To pass a function you defined to something that takes a function, write its name with the `@` instead of calling it:

  ```json
  {
    "@isBigNumber($n)": "$n >= 100",
    "$numbers": [50, 75, 100, 200],
    "firstBigNumber": "$numbers:find(@isBigNumber)"
  }
  ```

  gives `{ "firstBigNumber": 100 }`.
- A parameter written `@f` rather than `$f` takes a function: with `"@twice(@f, $x)": "@f(@f($x))"` and
  `"@inc($n)": "$n + 1"`, `@twice(@inc, 5)` is `7` and `@twice($n => $n * 3, 2)` is `18`.

## 10. Output promotion: `"()"`

Sometimes you want a single value as the result, but you need variables and functions to compute it. A property named
`"()"` makes the object **evaluate to that value** instead of to an object:

```json
{
  "$pi": 3.14159,
  "@area($r)": "$pi * $r:pow(2)",
  "()": "@area($)"
}
```

With `$ = 3` the result is the number `28.27431`, not an object. Only variable and function declarations may sit beside
`"()"`; other output keys are a compile error. It works at any level of nesting, not just at the top.

## 11. Optional keys, dynamic keys and comments

**Optional outputs.** A key ending in `?` is left out of the result when its value is `null` or `undefined`, instead of
appearing as `null`:

```json
{ "name": "$.name", "nickname?": "$.nickname" }
```

gives `{ "name": "Ada" }` when there is no nickname, and `{ "name": "Ada", "nickname": "Countess" }` when there is.
(The `?` isn't part of the output name.)

**Dynamic keys.** `"{ source as $v, $k }"` produces one property for each item of an array or object. For an array the
key is the item (as a string), `$v` is the item and `$k` is its index. For an object the key is the object's key, `$v`
is the value and `$k` is the key:

```json
{ "{$.prices as $p, $i}": "$p * 2" }
```

With `$ = { prices: [10, 20] }` that is `{ "10": 20, "20": 40 }`.

```json
{ "{$.rates as $v, $k}": "$k + '=' + $v" }
```

With `$ = { rates: { usd: 1, eur: 0.9 } }` that is `{ "usd": "usd=1", "eur": "eur=0.9" }`.

**Comments.** JSON has none, so a key starting with `//` is ignored. Its value doesn't matter (use `""`):

```json
{ "// shipping is free over 50": "", "shipping": "0 if $total >= 50 else 4.99" }
```

## 12. A complete example

Everything together: variables, a function, a lambda, a condition, an optional key and a comment.

```json
{
  "// summarize an order": "",
  "$lines": "$.items:map($i => { sku: $i.sku, total: $i.price * $i.qty })",
  "$subtotal": "$lines:reduce(($sum, $l) => $sum + $l.total, 0)",
  "$shipping": "0 if $subtotal >= 50 else 4.99",
  "@money($n)": "($n * 100):math~round / 100",

  "customer": "$.customer.name:toTitleCase",
  "lines": "$lines",
  "shipping": "$shipping",
  "total": "@money($subtotal + $shipping)",
  "coupon?": "$.coupon?:toUpperCase",
  "categories": "$.items:map($i => $i.category):sort"
}
```

Input `$`:

```json
{
  "customer": { "name": "ada lovelace" },
  "items": [
    { "sku": "A1", "price": 4.5, "qty": 2, "category": "book" },
    { "sku": "B2", "price": 30, "qty": 1, "category": "toy" }
  ],
  "coupon": "save10"
}
```

Result:

```json
{
  "customer": "Ada Lovelace",
  "lines": [{ "sku": "A1", "total": 9 }, { "sku": "B2", "total": 30 }],
  "shipping": 4.99,
  "total": 43.99,
  "coupon": "SAVE10",
  "categories": ["book", "toy"]
}
```

Run it again without a `coupon` and the `coupon` key is simply absent.

## When something goes wrong

Every error carries the position in the template: the path of the field being computed, the line and the column within
the expression.

| Error | When | Example |
|---|---|---|
| `FxSyntaxError` | at `compile` | the expression text isn't valid |
| `FxCompileError` | at `compile` | unknown function (with suggestions), wrong number of arguments, a variable that depends on itself |
| `FxRuntimeError` | at `run` | `Cannot read properties of undefined (reading 'b')` for `$.a.b` when `a` is missing; the original error is the `cause` |

Run `npx json-fx check your-template.json` to find compile errors, warnings and bare words in templates without
running them (see the [README](../README.md#checking-templates-json-fx-check)).

### Bare words

A word that isn't a keyword or a function name is treated as a string constant: `ifElse($.x, yes, no)` returns `"yes"`
or `"no"`. This is kept from 0.x for compatibility, but it is fragile, because adding a function called `yes` later
would silently change the template. **Write string constants in quotes** (`'yes'`). `compiled.bareWords` and
`json-fx check` list them, and `strictIdentifiers: true` makes them errors.

## Syntax summary

| Form | Meaning |
|---|---|
| `1`  `1.5`  `1e3`  `'text'`  `true`  `null`  `undefined` | literals; strings use `'…'`, with `\'` and `\\` |
| `[a, b]`  `{ k: v, 'k 2': v }` | array and object literals |
| `$`  `$name` | an input, variable or lambda parameter |
| `x.prop`  `x.'odd key'`  `x[i]`  `x[i, j]`  `x{k1, k2}` | property, index, several indexes, pick |
| `f(a, b)`  `a:f(b)`  `a:f` | call; chain (`a` becomes the first argument) |
| `@fn(a)`  `@fn` | call a function the template defines; pass it as a value |
| `x?.p`  `x?:f`  `x?[i]`  `x?{k}` | stop the rest of the chain with `null` if `x` is `null` or `undefined` |
| `$x => e`  `($a, $b) => e` | lambda |
| `A if C else B` | condition |
| `e for $x in A` | comprehension (`A:map($x => e)`) |
| `+ - * / % **`  `== === != !==`  `< <= > >=`  `&& \|\|`  `!  !!  -x` | operators (all are functions) |

Object template keys:

| Key | Meaning |
|---|---|
| `"name"` | an output; its value is a constant, an expression string or a nested template |
| `"name?"` | an output left out when its value is `null` or `undefined` |
| `"$var"` | a variable, computed lazily and at most once |
| `"@fn($a, $b)"` | a function (`@f` as a parameter takes a function) |
| `"()"` | the single value the object evaluates to |
| `"{ source as $v, $k }"` | one output per item of an array or entry of an object |
| `"// …"` | a comment |

**Precedence**, loosest to tightest: lambda `=>`; `A if C else B`; `for … in`; `||`; `&&`; comparisons; `+ -`;
`* / %`; `**` (right-associative); prefix operators (`-`, `!`, `!!`); chains. Prefix operators apply to the whole chain
after them: `-$.x` is `-($.x)`.
