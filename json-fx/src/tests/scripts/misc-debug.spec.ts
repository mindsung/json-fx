import { describe, it } from "mocha";
import { assert } from "chai";
import { ScriptTester } from "../script-tester";

describe("Scripts [misc/debug]", function (): void {

  const tester = new ScriptTester();

  tester.input({ name: "$", value: {
    a: [
      { b: [1, 2, 3, 4] },
      { b: [5, 6, 7] }
    ]
  }});

  it("Doesn't f*#! this up", function (): void {
    const result = tester.run({
      "@addValues($items, @valueExpr)": {
        "@reducer($total, $item)": {
          "$itemTotal": "ifElse($item != null, @valueExpr($item), 0)",
          "()": "ifElse($itemTotal != null, log('total:', $total) + log('add:', $itemTotal), log('no-add-total', $total))"
        },
        "()": "$items?:reduce(@reducer, 0)"
      },
      "@countLevel2($a)": "@addValues($a.b, $n => 1)",
      "()": "@addValues($.a, @countLevel2)"
    });
    assert.deepEqual(result, 7);
  });

  it("Doesn't f*#! this up either", function (): void {
    const result = tester.run({
      "@echo($val)": {
        "@anotherEcho($val2)": {
          "$ret": "$val2",
          "()": "$ret"
        },
        "()": "@anotherEcho($val)"
      },
      "()": "@echo(2) + @echo(3)"
    });
    assert.deepEqual(result, 5);
  });
});
