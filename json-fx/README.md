# JSON-fx
**JSON-fx** is a query and transform engine for JavaScript objects.
It defines an intuitive, declarative syntax for expressing an output value as a function of one or more input values.

Templates are parsed and compiled at runtime into expression trees, which are very efficient and lightweight wrappers
around the native JavaScript code they execute. The library includes a large collection of built-in expressions,
and is easily extensible.

The **JSON-fx** core library, which includes the parser/compiler and built-in expression set, has no external
runtime dependencies, giving it an extremely compact footprint.

## Installation

```sh
npm install @mindsung/json-fx
```

## Usage

```ts
import { JsonFx } from "@mindsung/json-fx";

const myCustomExtensions = [
  {
    name: "addFive",
    evaluate: n => n + 5
  }
];

const myInput = {
  someInputProp: 10,
  anotherInputProp: "hello"
};

const mySimpleTemplateJson = {
  "@myRuntimeFunction($a, $b)": "'The answer is: ' + ($a + $b)",
  "$myVar": "'The var is: ' + @myRuntimeFunction($.someInputProp:addFive, 100)",
  "someOutputProp": "'The prop is: ' + $myVar",
  "anotherOutputProp": "'The other prop is: ' + @myRuntimeFunction($.anotherInputProp, 100)"
};

const fx = new JsonFx(myCustomExtensions);
const compiled = fx.compile(mySimpleTemplateJson);
const output = compiled.evaluate({ name: "$", value: myInput });

console.log(JSON.stringify(output, null, 2));
```

Yields the output:
```json
{
  "someOutputProp": "The prop is: The var is: The answer is: 115",
  "anotherOutputProp": "The other prop is: The answer is: hello100"
}
```
