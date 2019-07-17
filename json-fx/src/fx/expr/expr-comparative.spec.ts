import { ExpressionTester } from "./expression.spec";
import { exprComparative } from "./expr-comparative";
import { assert } from "chai";

const tester = new ExpressionTester("Comparative", exprComparative);

tester.run(() => {

  tester.test("eq", fn => {
    assert.isTrue(fn(0, 0));
    assert.isTrue(fn("foo", "foo"));
    assert.isTrue(fn(true, true));
    assert.isTrue(fn(null, null));

    assert.isFalse(fn(0, 1));
    assert.isFalse(fn("foo", "bar"));
    assert.isFalse(fn(true, false));
    assert.isFalse(fn(null, 0));
  });

  tester.test("neq", fn => {
    assert.isFalse(fn(0, 0));
    assert.isFalse(fn("foo", "foo"));
    assert.isFalse(fn(true, true));
    assert.isFalse(fn(null, null));

    assert.isTrue(fn(0, 1));
    assert.isTrue(fn("foo", "bar"));
    assert.isTrue(fn(true, false));
    assert.isTrue(fn(null, 0));
  });

  tester.test("gt", fn => {
    assert.isTrue(fn(1, 0));
    assert.isFalse(fn(1, 1));
    assert.isFalse(fn(1, 2));
  });

  tester.test("gte", fn => {
    assert.isTrue(fn(1, 0));
    assert.isTrue(fn(1, 1));
    assert.isFalse(fn(1, 2));
  });

  tester.test("lt", fn => {
    assert.isTrue(fn(0, 1));
    assert.isFalse(fn(1, 1));
    assert.isFalse(fn(2, 1));
  });

  tester.test("lte", fn => {
    assert.isTrue(fn(0, 1));
    assert.isTrue(fn(1, 1));
    assert.isFalse(fn(2, 1));
  });
});
