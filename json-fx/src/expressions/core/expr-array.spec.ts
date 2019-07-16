import { ExpressionTester } from "../expression.spec";
import { exprArray } from "./expr-array";
import { assert } from "chai";

const tester = new ExpressionTester("Array", exprArray);

tester.run(() => {

  tester.test("item", fn => {
    assert.equal(fn([2, 4, 6], 1), 4);
  });

  tester.test("map", fn => {
    assert.deepEqual(fn([2, 4, 8], i => i - 1), [1, 3, 7]);
  });

  tester.test("sort", fn => {
    assert.deepEqual(fn(["bb", "aa", "cc"]), ["aa", "bb", "cc"]);
    assert.deepEqual(fn(["bb", "a", "ccc"], i => i.length), ["a", "bb", "ccc"]);
  });

  tester.test("filter", fn => {
    assert.deepEqual(fn([1, 2, 3, 4], i => i % 2 == 0), [2, 4]);
  });

  tester.test("reduce", fn => {
    assert.deepEqual(fn([1, 2, 3, 4], (acc, i) => acc + i, 0), 10);
  });

  tester.test("find", fn => {
    assert.equal(fn([1, 2, 3, 4], i => i % 2 == 0), 2);
  });

  tester.test("concat", fn => {
    assert.deepEqual(fn([0, 1], [2, 3], [4, 5]), [0, 1, 2, 3, 4, 5]);
  });

  tester.test("min", fn => {
    assert.equal(fn([0, 1, 2, 3]), 0);
  });

  tester.test("max", fn => {
    assert.equal(fn([0, 1, 2, 3]), 3);
  });

  tester.test("avg", fn => {
    assert.equal(fn([0, 1, 2, 3]), 1.5);
  });

  tester.test("length", fn => {
    assert.equal(fn([0, 1, 2, 3]), 4);
  });

  tester.test("range", fn => {
    assert.deepEqual(fn(0, 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
