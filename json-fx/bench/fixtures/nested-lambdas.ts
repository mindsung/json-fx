import type { BenchFixture } from "./types";

export const nestedLambdas: BenchFixture = {
  name: "nested-lambdas",
  description: "array-heavy: lambdas nested three deep (map > reduce/filter/max)",
  template: {
    "groups": "$.groups:map($g => { 'name': $g.name, 'total': $g.items:reduce(($a, $i) => $a + $i.qty * $i.price, 0), 'top': $g.items:filter($i => $i.qty > 2):map($i => $i.sku), 'maxPrice': $g.items:max($i => $i.price) })",
    "grand": "$.groups:map($g => $g.items:length):reduce(($a, $n) => $a + $n, 0)"
  },
  makeInput: (k) => ({
    groups: Array.from({ length: 5 }, (_, g) => ({
      name: `g${k}-${g}`,
      items: Array.from({ length: 8 }, (_, j) => ({ sku: `s${g}-${j}`, qty: (j + g + k) % 5, price: 1 + ((k + g * 3 + j * 5) % 30) }))
    }))
  }),
  handWritten: (d) => ({
    groups: d.groups.map((g: any) => ({
      name: g.name,
      total: g.items.reduce((a: number, i: any) => a + i.qty * i.price, 0),
      top: g.items.filter((i: any) => i.qty > 2).map((i: any) => i.sku),
      maxPrice: g.items.reduce((m: number | null, i: any) => (m == null || i.price > m ? i.price : m), null)
    })),
    grand: d.groups.map((g: any) => g.items.length).reduce((a: number, n: number) => a + n, 0)
  })
};
