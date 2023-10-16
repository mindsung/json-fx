const JsonFx = require('@mindsung/json-fx').JsonFx;
const fs = require('fs');

function compileMapTemplate(template) {
  return new JsonFx().compile({
    "@mapFn($)": template,
    "()": "$data?:map(@mapFn)"
  });
}

const upperLowerTemplate = compileMapTemplate(JSON.parse(fs.readFileSync('./templates/upper-lower.json')));
const joinStringsTemplate = compileMapTemplate(JSON.parse(fs.readFileSync('./templates/join-strings.json')));

function mapTemplate(compiledTemplate, data) {
  return compiledTemplate.evaluate({ name: "$data", value: data });
}

console.log(mapTemplate(upperLowerTemplate, [
  "Hello",
  "World!"
]));

console.log(mapTemplate(joinStringsTemplate, [
  ["a", "b", "c"],
  ["d", "e", "f"]
]));

// Output:
//
// [
//   { upper: 'HELLO', lower: 'hello' },
//   { upper: 'WORLD!', lower: 'world!' }
// ]
// [ 'a,b,c', 'd,e,f' ]
