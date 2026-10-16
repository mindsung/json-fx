import { describe, expect, it } from "vitest";
import { JsonFx } from "../api/json-fx";
import { FxRuntimeError } from "../errors";

const on = new JsonFx({ backend: "codegen" });
const off = new JsonFx({ backend: "codegen", optimize: false });

const src = (template: unknown, fx = on): string => fx.compile(template).source as string;

/** Same value with and without the optimizer, on both backends. */
function same(template: unknown, inputs: Record<string, unknown> = {}): unknown {
  const results = [
    off.compile(template).run(inputs),
    on.compile(template).run(inputs),
    new JsonFx({ backend: "closure" }).compile(template).run(inputs)
  ];
  expect(results[1]).toEqual(results[0]);
  expect(results[2]).toEqual(results[0]);
  return results[1];
}

describe("optimizer: constant folding", () => {
  it("folds operators and pure calls with literal arguments", () => {
    expect(src({ n: "1 + 2 * 3" })).toContain('"n": 7');
    expect(src({ n: "1 + 2 * 3" }, off)).not.toContain('"n": 7');
    expect(src({ s: "'a' + 'b'" })).toContain('"s": "ab"');
    expect(src({ s: "math~round(2.567 * 100) / 100" })).toContain('"s": 2.57');
    expect(same({ n: "1 + 2 * 3", s: "'ab':toUpperCase() + 'c'" })).toEqual({ n: 7, s: "ABc" });
  });

  it("folds receiver chains of pure functions: 'ab':toUpperCase():length", () => {
    expect(src({ s: "'ab':toUpperCase()" })).toContain('"s": "AB"');
  });

  it("leaves a fold that throws for run time, with the same error", () => {
    const template = { a: "null:toString()" };
    expect(() => on.compile(template).run({})).toThrow(FxRuntimeError);
    expect(() => off.compile(template).run({})).toThrow(FxRuntimeError);
    expect(() => on.compile({ a: "notNull(null)" }).run({})).toThrow(FxRuntimeError);
  });

  it("does not fold non-primitive results, impure functions or extension functions", () => {
    expect(src({ r: "range(0, 3)" })).toContain("k0(0, 3)");
    const fx = new JsonFx({ backend: "codegen", functions: [[{ name: "ext", evaluate: () => 1 }]] });
    expect(fx.compile({ x: "ext()" }).source).not.toContain('"x": 1');
    // a huge range is never evaluated at compile time
    expect(() => on.compile({ r: "range(0, 1e9)" })).not.toThrow();
    expect(on.compile({ r: "dateTime(0)" }).run({}).r).not.toBe(on.compile({ r: "dateTime(0)" }).run({}).r);
  });

  it("does not fold math~random", () => {
    const t = on.compile({ a: "math~random()" });
    const values = new Set(Array.from({ length: 20 }, () => t.run({}).a));
    expect(values.size).toBeGreaterThan(1);
  });

  it("folds -0, NaN and Infinity faithfully", () => {
    const r = same({ a: "-0", b: "0 / 0", c: "1 / 0", d: "-1 / 0", e: "0 * -1" }) as Record<string, number>;
    expect(Object.is(r["a"], -0)).toBe(true);
    expect(Object.is(r["e"], -0)).toBe(true);
    expect(r["b"]).toBeNaN();
    expect(r["c"]).toBe(Infinity);
    expect(r["d"]).toBe(-Infinity);
  });

  it("keeps long folded strings out of the source", () => {
    const long = "x".repeat(2000);
    expect(src({ s: `'${long}' + 'y'` })).not.toContain(long + "y");
    expect(same({ s: `'${long}' + 'y'` })).toEqual({ s: long + "y" });
  });

  it("picks the branch of a literal condition and of && / ||", () => {
    expect(src({ a: "1 if true else $.x" })).not.toContain('"x"');
    expect(src({ a: "ifElse(false, $.x, 5)" })).toContain('"a": 5');
    expect(same({ a: "0 || $.v", b: "1 && $.v", c: "'' && $.v", d: "'k' || $.v" }, { $: { v: 7 } })).toEqual({ a: 7, b: 7, c: "", d: "k" });
  });
});

describe("optimizer: variables and declarations", () => {
  it("inlines a variable bound to a literal and removes it", () => {
    const s = src({ $rate: 0.2, tax: "$.price * $rate" });
    expect(s).toContain("0.2");
    expect(s).not.toContain("cyclic");
    expect(same({ $rate: 0.2, tax: "$.price * $rate" }, { $: { price: 50 } })).toEqual({ tax: 10 });
  });

  it("chains: a var computed from literal vars is itself inlined", () => {
    const template = { $a: 2, $b: "$a + 1", $c: "$b * $b", out: "$c" };
    expect(src(template)).toContain('"out": 9');
    expect(src(template)).not.toMatch(/\bw\d/); // no memo state left
    expect(same(template)).toEqual({ out: 9 });
  });

  it("inlines into nested scopes, lambdas and functions", () => {
    same({ $k: 3, "@f($x)": "$x * $k", a: "$.items:map($i => $i + $k)", b: "@f(2)" }, { $: { items: [1, 2] } });
    expect(same({ $k: 3, "@f($x)": "$x * $k", b: "@f(2)" })).toEqual({ b: 6 });
  });

  it("respects shadowing", () => {
    expect(same({ $x: 1, inner: { $x: 2, v: "$x" }, outer: "$x" })).toEqual({ inner: { v: 2 }, outer: 1 });
    expect(same({ $x: 1, a: "[1, 2]:map($x => $x * 10)" })).toEqual({ a: [10, 20] });
  });

  it("removes unreferenced variables and functions, including chains and self-recursion", () => {
    const template = { $dead: "$.x * 2", $dead2: "$dead + 1", "@gone($n)": "@gone($n - 1)", "@used($n)": "$n + 1", v: "@used(1)" };
    const s = src(template);
    expect(s).not.toContain("dead");
    expect(s).not.toContain("gone");
    expect(same(template)).toEqual({ v: 2 });
  });

  it("an unreferenced declaration that would fail never runs, with or without the optimizer", () => {
    expect(same({ $boom: "throw('x')", ok: 1 })).toEqual({ ok: 1 });
    expect(same({ $boom: "$.nope.deeper", ok: 1 })).toEqual({ ok: 1 });
  });

  it("keeps variables that fields reach through lambdas and nested objects", () => {
    expect(same({ $v: "$.n * 2", a: { b: { c: "$v" } }, f: "[1]:map($i => $i + $v)" }, { $: { n: 4 } })).toEqual({ a: { b: { c: 8 } }, f: [9] });
  });

  it("recursion and mutual recursion still work", () => {
    expect(same({ "@fact($n)": "1 if $n <= 1 else $n * @fact($n - 1)", v: "@fact(5)" })).toEqual({ v: 120 });
  });

  it("optimize: false switches it off per template and per instance", () => {
    const template = { $a: 1, v: "$a + 1" };
    expect(on.compile(template, { optimize: false }).source).toEqual(off.compile(template).source);
    expect(off.compile(template, { optimize: true }).source).toEqual(on.compile(template).source);
  });
});

describe("optimizer: error attribution is unchanged", () => {
  const where = (fx: JsonFx, template: unknown, inputs: Record<string, unknown> = {}) => {
    try { fx.compile(template, { name: "t" }).run(inputs); } catch (e) { const err = e as FxRuntimeError; return [err.message, err.sourceRef]; }
    return null;
  };

  it.each([
    ["a native error in the chosen branch of a literal condition", { a: "$.n:min() if true else 1" }],
    ["an undefined variable in the chosen branch", { a: "$extra if true else 1" }],
    ["an error in a lazy argument", { a: "throw(ifElse(true, 'x', 'y'))" }],
    ["an error through an inlined variable", { $o: 5, a: "$o.x.y" }],
    ["a failing fold next to a literal var", { $s: "'x'", a: "null:toString() + $s" }],
    ["a literal || with a failing right side", { a: "0 || $.nope.deeper" }]
  ])("%s", (_name, template) => {
    const inputs = { $: { n: 1 } };
    expect(where(on, template, inputs)).toEqual(where(off, template, inputs));
    expect(where(on, template, inputs)).not.toBeNull();
  });
});
