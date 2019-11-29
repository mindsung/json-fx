import { describe, it } from "mocha";
import { assert } from "chai";
import { ScriptTester } from "../script-tester";
import { isObject } from "../../common";

function separateExpects(templ: any, path: string = ""): { template: any, expects: any } {
  return Object.keys(templ).reduce((acc, key) => {
    const value = templ[key];

    if (key.endsWith("-expects")) {
      const trimKey = key.substring(0, key.indexOf("-expects"));
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

function assertExpects(output: any, expects: any): void {
  for (const eKey of Object.keys(expects)) {
    const path = eKey.split(".");
    let actual = output;

    for (const pathItem of path) {
      actual = actual[pathItem];
    }

    assert.deepEqual(actual, expects[eKey]);
  }
}

describe("Scripts [dynamic fields]", function (): void {

  const tester = new ScriptTester();

  tester.input({ name: "$a", value: [] });
  tester.input({ name: "$o", value: {} });

  it("Evaluates constant emitter", function (): void {
    const result1 = tester.run({ "{ 'A' }": 0 });
    const result2 = tester.run({ "{ 'A' as $ }": "$" });
    assert.deepEqual(result1, { "A": 0 });
    assert.deepEqual(result2, { "A": "A" });
  });

  it("Evaluates array literal emitter", function (): void {
    const result = tester.run({ "{ ['A', 'B', 'C'] as $v, $i }": "$v:lowercase() + $i" });
    assert.deepEqual(result, { "A": "a0", "B": "b1", "C": "c2" });
  });

  it("Evaluates object literal emitter", function (): void {
    const result = tester.run({ "{ {a:10, b:20, c:30} as $v, $k }": "$k + $v" });
    assert.deepEqual(result, { "a": "a10", "b": "b20", "c": "c30" });
  });

  it("Evaluates variable emitter", function (): void {
    const result = tester.run({ "$var": "'a'", "{ $var as $ }": "$:uppercase()" });
    assert.deepEqual(result, { "a": "A" });
  });

  it("Evaluates template emitter", function (): void {
    const result = tester.run({ "@tem($)": "$:uppercase()", "{ @tem('hello') as $ }": "$:titlecase()" });
    assert.deepEqual(result, { "HELLO": "Hello" });
  });

  it("Evaluates expression emitter", function (): void {
    const result = tester.run({ "$arr": [2, 4, 8], "{$arr:map($ => $ ** 2) as $}": "$ ** 0.5" });
    assert.deepEqual(result, { "4": 2, "16": 4, "64": 8 });
  });

  it("Evaluates literal key", function (): void {
    const result = tester.run("'a b c'");
    // assert.deepEqual(result, {"a-plus-b": 11});
  });

  it("Separates expects", function (): void {
    const templ = { "foo": { "a": 10, "a-expects": 10 }, "foo-expects": { "a": 10 } };
    const result = separateExpects(templ);
    assertExpects(tester.run(result.template), result.expects);
  });
});
