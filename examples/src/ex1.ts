import { JsonFx } from "@mindsung/json-fx";

const myCustomExtensionFunctions = [
  {
    name: "addFive",
    evaluate: n => n + 5
  }
];

const myInput = {
  someInputProp: 10,
  anotherInputProp: "hello"
};

const myTemplate = {
  "@myRuntimeFunction($a, $b)": "'The answer is: ' + ($a + $b)",
  "$myVar": "'The var is: ' + @myRuntimeFunction($.someInputProp:addFive, 100)",
  "someOutputProp": "'The prop is: ' + $myVar",
  "anotherOutputProp": "'The other prop is: ' + @myRuntimeFunction($.anotherInputProp, 100)"
};

const fx = new JsonFx(myCustomExtensionFunctions);
const compiled = fx.compile(myTemplate);
const output = compiled.evaluate({ name: "$", value: myInput });

console.log(JSON.stringify(output, null, 2));

const template = {
  "@isBigNumber($n)": "$n >= 100",
  "$numbers": [50, 75, 100, 200],
  firstBigNumber: "$numbers:find(@isBigNumber)"
};

console.log(new JsonFx().compile(template).evaluate({ name: "$", value: {
    someProp_: {
      someMissingProp: "Hello World!"
    }
  }
}));
