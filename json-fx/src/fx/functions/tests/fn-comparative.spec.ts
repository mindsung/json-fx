import { FnComparative } from "../fn-comparative";
import { assert } from "chai";
import { ExpressionTester } from "../../../tests/expression-tester";

describe("Expressions [comparative]", function (): void {

  const tester = new ExpressionTester(FnComparative);

  it("Evaluates [eq]", function (): void {
    const fn = tester.get("eq");

    assert.isTrue(fn(0, 0));
    assert.isTrue(fn("foo", "foo"));
    assert.isTrue(fn(true, true));
    assert.isTrue(fn(null, null));

    assert.isFalse(fn(0, 1));
    assert.isFalse(fn("foo", "bar"));
    assert.isFalse(fn(true, false));
    assert.isFalse(fn(null, 0));
  });

  it("Evaluates [neq]", function (): void {
    const fn = tester.get("neq");

    assert.isFalse(fn(0, 0));
    assert.isFalse(fn("foo", "foo"));
    assert.isFalse(fn(true, true));
    assert.isFalse(fn(null, null));

    assert.isTrue(fn(0, 1));
    assert.isTrue(fn("foo", "bar"));
    assert.isTrue(fn(true, false));
    assert.isTrue(fn(null, 0));
  });

  it("Evaluates [gt]", function (): void {
    const fn = tester.get("gt");

    assert.isTrue(fn(1, 0));
    assert.isFalse(fn(1, 1));
    assert.isFalse(fn(1, 2));
  });

  it("Evaluates [gte]", function (): void {
    const fn = tester.get("gte");

    assert.isTrue(fn(1, 0));
    assert.isTrue(fn(1, 1));
    assert.isFalse(fn(1, 2));
  });

  it("Evaluates [lt]", function (): void {
    const fn = tester.get("lt");

    assert.isTrue(fn(0, 1));
    assert.isFalse(fn(1, 1));
    assert.isFalse(fn(2, 1));
  });

  it("Evaluates [lte]", function (): void {
    const fn = tester.get("lte");

    assert.isTrue(fn(0, 1));
    assert.isTrue(fn(1, 1));
    assert.isFalse(fn(2, 1));
  });

  tester.done();
});
