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
