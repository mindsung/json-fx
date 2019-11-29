import * as fs from "fs";
import { JsonFx } from "..";
import { describe, it } from "mocha";
import { assert } from "chai";

const testFiles = fs.readdirSync("../examples").filter(f => f.endsWith(".fx.json"));

testFiles.forEach(f => {
  describe("Test examples: " + f, () => {
    const input = JSON.parse(fs.readFileSync("../examples/" + f).toString());
    const expectKeys = Object.keys(input).filter(k => k.startsWith("$") || k.endsWith("-expect"));
    console.log(expectKeys);
    const template = expectKeys.reduce((t, k) => {
      const testKey = k.match(/(.*)-expect$/)[1];
      if (input[testKey] != null) {
        t[testKey] = input[testKey];
      }
      return t;
    }, {});
    const output = new JsonFx().compile(template).evaluate();
    Object.keys(output).forEach(testKey => {
      it(testKey, () => {
        assert.deepEqual(output[testKey], input[testKey + "-expect"]);
      });
    });
  });
});
