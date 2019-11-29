import { describe, it } from "mocha";
import { assert } from "chai";
import { ScriptTester } from "../script-tester";

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
});
