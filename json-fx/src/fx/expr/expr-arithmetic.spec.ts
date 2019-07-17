import { ExpressionTester } from "./expression.spec";
import { exprArithmetic } from "./expr-arithmetic";
import { assert } from "chai";

const tester = new ExpressionTester("Arithmetic", exprArithmetic);

tester.run(() => {

  tester.test("add", fn => {
    assert.equal(fn(1, 2), 3);
  });

  tester.test("sub", fn => {
    assert.equal(fn(1, 2), -1);
  });

  tester.test("mul", fn => {
    assert.equal(fn(2, 3), 6);
  });

  tester.test("div", fn => {
    assert.equal(fn(1, 2), 0.5);
  });

  tester.test("pow", fn => {
    assert.equal(fn(2, 3), 8);
  });

  tester.test("mod", fn => {
    assert.equal(fn(3, 2), 1);
  });
});
