const JsonFx = require('@mindsung/json-fx').JsonFx;
const fs = require('fs');

const compiledTemplate = new JsonFx().compile({
  "@mapFn($)": {
    upperLowerChart: JSON.parse(fs.readFileSync('./templates/upper-lower.json')),
    joinStringsChart: JSON.parse(fs.readFileSync('./templates/join-strings.json'))
  },
  "()": "$data?:map(@mapFn)"
});

const data = JSON.parse(fs.readFileSync('./data/words-and-letters.json'));

const chartResults = compiledTemplate.evaluate({ name: "$data", value: data });

console.log(chartResults);

// Output:
//
// [
//   {
//     upperLowerChart: { upper: 'HELLO', lower: 'hello' },
//     joinStringsChart: 'a,b,c'
//   },
//   {
//     upperLowerChart: { upper: 'WORLD!', lower: 'world!' },
//     joinStringsChart: 'a,b,c'
//   }
// ]
