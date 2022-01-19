import { describe, it } from "mocha";
import { assert } from "chai";
import { ScriptTester } from "../script-tester";

describe("Scripts [misc/debug]", function (): void {

  const tester = new ScriptTester();

  tester.input({ name: "$", value: {
    a: [
      { b: [{ c: [ 1, 2, 3, 4] }, { c: [1, 2, 3] }] },
      { b: [{ c: null }, { c: [1, 2, 3] }, { c: [1, 2, 3, 4, 5, 6] }, { c: [1, null, 3, 4] }] }
    ]
  }});

  it("It seems to f*#! this up", function (): void {
    const result = tester.run({
      "@addValues($items, $accumValue, @valueExpr)": {
        "@reducer($total, $item)": {
          "$itemTotal": "ifElse($item != null, @valueExpr($item, $total), 0)",
          "()": "ifElse($itemTotal != null, log('total:', $total) + log('add:', $itemTotal), log('no-add-total', $total))"
        },
        "()": "log('reduce result:', log('accum:', $accumValue) + $items?:reduce(@reducer, $accumValue))"
      },
      "@countLevel2($a, $prevValue)": "@addValues($a.b, $prevValue, $n => 1)",
      "()": "@addValues($.a, 0, @countLevel2)"
    });
    assert.deepEqual(result, 5);
  });

  it("This works", function (): void {
    const totals = tester.run({
      "@addTotals($t1, $t2)": "{ count: ($t1?.count || 0) + ($t2?.count || 0), sum: ($t1?.sum || 0) + ($t2?.sum || 0) }",
      "@totalCs($cs)": "$cs?:reduce(($total, $c) => @addTotals($total, ifElse($c != null, { count: 1, sum: $c })))",
      "@totalBs($bs)": "$bs?:reduce(($total, $b) => @addTotals($total, ifElse($b != null, @totalCs($b?.c))))",
      "()": "$.a?:reduce(($total, $a) => @addTotals($total, ifElse($a != null, @totalBs($a?.b))))"
    });
    assert.deepEqual(totals, { count: 19, sum: 51 });
  });
});
