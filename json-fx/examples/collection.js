const JsonFx = require('@mindsung/json-fx').JsonFx;

const template = {
  "@mapFn($item)": {
    "upper": "$item:toUpperCase",
    "lower": "$item:toLowerCase"
  },
  "()": "$?:map(@mapFn)"
};
const data = ["Hello", "World!"];
const fx = new JsonFx().compile(template);
const result = fx.evaluate({ name: "$", value: data });
console.log(result);
// Output:
//
// [
//   { upper: 'HELLO', lower: 'hello' },
//   { upper: 'WORLD!', lower: 'world!' }
// ]
