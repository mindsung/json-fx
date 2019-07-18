import { exprArithmetic } from "./expr-arithmetic";
import { describe, it, before, after } from "mocha";
import { assert } from "chai";
import { ExpressionTester } from "../../tests/expression-tester";


describe("Expressions [arithmetic]", function (): void {

  const tester = new ExpressionTester(exprArithmetic);

  it("Evaluates [add]", function (): void {
    const fn = tester.get("add");
    assert.equal(fn(1, 2), 3);
  });

  it("Evaluates [sub]", function (): void {
    const fn = tester.get("sub");
    assert.equal(fn(1, 2), -1);
  });

  it("Evaluates [mul]", function (): void {
    const fn = tester.get("mul");
    assert.equal(fn(2, 3), 6);
  });

  it("Evaluates [div]", function (): void {
    const fn = tester.get("div");
    assert.equal(fn(1, 2), 0.5);
  });

  it("Evaluates [pow]", function (): void {
    const fn = tester.get("pow");
    assert.equal(fn(2, 3), 8);
  });

  it("Evaluates [mod]", function (): void {
    const fn = tester.get("mod");
    assert.equal(fn(3, 2), 1);
  });

  it("Evaluates [neg]", function (): void {
    const fn = tester.get("neg");
    assert.equal(fn(2), -2);
  });

  tester.done();
});
