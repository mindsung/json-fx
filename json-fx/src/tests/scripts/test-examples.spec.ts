import * as fs from "fs";
import { JsonFx } from "../..";
import { describe, it } from "mocha";
import { assert } from "chai";
import { isObject } from "../../common";

function separateExpects(template: any, path: string = ""): { template: any, expects: any } {
  return Object.keys(template).reduce((acc, key) => {
    const value = template[key];

    if (key.endsWith("-expect")) {
      const trimKey = key.substring(0, key.indexOf("-expect"));
      const subpath = path ? path + "." + trimKey : trimKey;

      acc.expects[subpath] = value;
    } else {
      if (isObject(value)) {
        const subpath = path != "" ? path + "." + key : key;
        const sep = separateExpects(value, subpath);
        acc.template[key] = sep.template;
        Object.assign(acc.expects, sep.expects);
      } else {
        acc.template[key] = value;
      }
    }
    return acc;
  }, { template: {}, expects: {} });
}

function testExpects(output: any, expects: any): void {
  for (const eKey of Object.keys(expects)) {
    const path = eKey.split(".");
    let actual = output;

    for (const pathItem of path) {
      actual = actual[pathItem];
    }

    it(eKey, () => {
      assert.deepEqual(actual, expects[eKey]);
    });
  }
}

// TODO: Recurse into directories

fs.readdirSync("../examples").filter(f => f.endsWith(".fx.json")).forEach(f => {
  describe("Test example file: " + f, () => {
    const te = separateExpects(JSON.parse(fs.readFileSync("../examples/" + f).toString()));
    const output = new JsonFx().compile(te.template).evaluate();
    if (process.argv.indexOf("--log") >= 0) {
      console.log("values:", output);
    }
    testExpects(output, te.expects);
  });
});
