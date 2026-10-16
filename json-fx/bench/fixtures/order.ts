import type { BenchFixture } from "./types";

// Helpers live at module level: tsx's keepNames would otherwise wrap per-call `const f = () => ...` closures in __name(),
// which inflates the hand-written timing relative to plain JS.
const taxRate = 0.08;
const lineTotal = (i: any) => i.qty * i.price;
const withTax = (n: number) => Math.round(n * (1 + taxRate) * 100) / 100;

/** V1-PLAN.md Appendix C: constant $var, two @functions, map/filter/reduce with lambdas, ?., math, string ops. */
export const order: BenchFixture = {
  name: "order",
  description: "order document: @functions, map/filter/reduce lambdas, ?., math (V1-PLAN.md Appendix C)",
  template: {
    "$taxRate": 0.08,
    "@lineTotal($i)": "$i.qty * $i.price",
    "@withTax($n)": "math~round($n * (1 + $taxRate) * 100) / 100",
    "customer": "$.customer.name:toUpperCase",
    "city": "$.customer.address?.city",
    "itemCount": "$.items:length",
    "lines": "$.items:map($i => { 'sku': $i.sku, 'total': @withTax(@lineTotal($i)) })",
    "big": "$.items:filter($i => @lineTotal($i) > 50):map($i => $i.sku)",
    "subtotal": "$.items:reduce(($acc, $i) => $acc + @lineTotal($i), 0)"
  },
  makeInput: (k) => ({
    customer: { name: "cust" + k, address: k % 2 ? { city: "X" + k } : null },
    items: Array.from({ length: 10 }, (_, j) => ({ sku: `s${k}-${j}`, qty: (j % 4) + 1, price: 5 + ((k * 7 + j * 13) % 40) }))
  }),
  handWritten: (d) => {
    return {
      customer: d.customer.name.toUpperCase(),
      city: d.customer.address == null ? null : d.customer.address.city,
      itemCount: d.items.length,
      lines: d.items.map((i: any) => ({ sku: i.sku, total: withTax(lineTotal(i)) })),
      big: d.items.filter((i: any) => lineTotal(i) > 50).map((i: any) => i.sku),
      subtotal: d.items.reduce((acc: number, i: any) => acc + lineTotal(i), 0)
    };
  }
};
