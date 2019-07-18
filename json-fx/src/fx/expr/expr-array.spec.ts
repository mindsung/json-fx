import { exprArray } from "./expr-array";
import { describe, it } from "mocha";
import { assert } from "chai";
import { ExpressionTester } from "../../tests/expression-tester";


describe("Expressions [array]", function (): void {

  const tester = new ExpressionTester(exprArray);

  it("Evaluates [item]", function (): void {
    const fn = tester.get("item");
    assert.equal(fn([2, 4, 6], 1), 4);
  });

  it("Evaluates [map]", function (): void {
    const fn = tester.get("map");
    assert.deepEqual(fn([2, 4, 8], i => i - 1), [1, 3, 7]);
  });

  it("Evaluates [sort]", function (): void {
    const fn = tester.get("sort");
    assert.deepEqual(fn(["bb", "aa", "cc"]), ["aa", "bb", "cc"]);
    assert.deepEqual(fn(["bb", "a", "ccc"], i => i.length), ["a", "bb", "ccc"]);
  });

  it("Evaluates [filter]", function (): void {
    const fn = tester.get("filter");
    assert.deepEqual(fn([1, 2, 3, 4], i => i % 2 == 0), [2, 4]);
  });

  it("Evaluates [reduce]", function (): void {
    const fn = tester.get("reduce");
    assert.deepEqual(fn([1, 2, 3, 4], (acc, i) => acc + i, 0), 10);
  });

  it("Evaluates [find]", function (): void {
    const fn = tester.get("find");
    assert.equal(fn([1, 2, 3, 4], i => i % 2 == 0), 2);
  });

  it("Evaluates [concat]", function (): void {
    const fn = tester.get("concat");
    assert.deepEqual(fn([0, 1], [2, 3], [4, 5]), [0, 1, 2, 3, 4, 5]);
  });

  it("Evaluates [min]", function (): void {
    const fn = tester.get("min");
    const data = [
      {id: 0, name: "AAA"},
      {id: 1, name: "BBB"},
      {id: 2, name: "CCC"},
    ];

    assert.equal(fn([0, 1, 2, 3]), 0);
    assert.equal(fn(data, i => i.id), 0);
  });

  it("Evaluates [findMin]", function (): void {
    const fn = tester.get("findMin");
    const data = [
      {id: 0, name: "AAA"},
      {id: 1, name: "BBB"},
      {id: 2, name: "CCC"},
    ];

    assert.equal(fn([0, 1, 2, 3]), 0);
    assert.deepEqual(fn(data, i => i.id), {id: 0, name: "AAA"});
  });

  it("Evaluates [max]", function (): void {
    const fn = tester.get("max");
    const data = [
      {id: 0, name: "AAA"},
      {id: 1, name: "BBB"},
      {id: 2, name: "CCC"},
    ];

    assert.equal(fn([0, 1, 2, 3]), 3);
    assert.equal(fn(data, i => i.id), 2);
  });

  it("Evaluates [findMax]", function (): void {
    const fn = tester.get("findMax");
    const data = [
      {id: 0, name: "AAA"},
      {id: 1, name: "BBB"},
      {id: 2, name: "CCC"},
    ];

    assert.equal(fn([0, 1, 2, 3]), 3);
    assert.deepEqual(fn(data, i => i.id), {id: 2, name: "CCC"});
  });

  it("Evaluates [avg]", function (): void {
    const fn = tester.get("avg");
    assert.equal(fn([0, 1, 2, 3]), 1.5);
  });

  it("Evaluates [length]", function (): void {
    const fn = tester.get("length");
    assert.equal(fn([0, 1, 2, 3]), 4);
  });

  it("Evaluates [range]", function (): void {
    const fn = tester.get("range");
    assert.deepEqual(fn(0, 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  tester.done();
});
