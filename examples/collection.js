const JsonFx = require('@mindsung/json-fx').JsonFx;
const fs = require('fs');

function compileMapTemplate(template) {
  return new JsonFx().compile({
    "@mapFn($)": template,
    "()": "$data?:map(@mapFn)"
  });
}

function mapData(compiledTemplate, data) {
  return compiledTemplate.evaluate({ name: "$data", value: data });
}

const upperLowerTemplate = compileMapTemplate(JSON.parse(fs.readFileSync('./templates/upper-lower.json')));

console.log(mapData(upperLowerTemplate, [
  "Hello",
  "World!"
]));

const joinStringsTemplate = compileMapTemplate(JSON.parse(fs.readFileSync('./templates/join-strings.json')));

console.log(mapData(joinStringsTemplate, [
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
