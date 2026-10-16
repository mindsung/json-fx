import { describe, expect, it } from "vitest";
import { JsonFx } from "../src-v1";

/** The examples of README.md, run for real (so the documentation can't drift from the behaviour). */

const fx = new JsonFx([{ name: "addFive", evaluate: (n: number) => n + 5 }, { name: "double", pure: true, evaluate: (n: number) => n * 2 }]);
const run = (template: unknown, inputs: Record<string, unknown> = {}) => fx.compile(template).run(inputs);

describe("README", () => {
  it("opening example", () => {
    expect(run({
      "$total": "$.items:map($i => $i.price * $i.qty):reduce(($a, $b) => $a + $b, 0)",
      customer: "$.customer.name:toTitleCase",
      total: "$total",
      size: "'large' if $total > 100 else 'small'"
    }, { $: { customer: { name: "ann lee" }, items: [{ price: 40, qty: 2 }, { price: 30, qty: 1 }] } }))
      .toEqual({ customer: "Ann Lee", total: 110, size: "large" });
  });

  it("quick start", () => {
    expect(run({
      "@myRuntimeFunction($a, $b)": "'The answer is: ' + ($a + $b)",
      "$myVar": "'The var is: ' + @myRuntimeFunction($.someInputProp:addFive, 100)",
      someOutputProp: "'The prop is: ' + $myVar",
      anotherOutputProp: "'The other prop is: ' + @myRuntimeFunction($.anotherInputProp, 100)"
    }, { $: { someInputProp: 10, anotherInputProp: "hello" } })).toEqual({
      someOutputProp: "The prop is: The var is: The answer is: 115",
      anotherOutputProp: "The other prop is: The answer is: hello100"
    });
  });

  it("evaluate() and declared inputs", () => {
    expect(fx.compile("$.a", { inputs: ["$"] }).evaluate({ name: "$", value: { a: 1 } })).toBe(1);
    expect(() => fx.compile("$typo", { inputs: ["$"] })).toThrow(/typo/);
    expect(() => run("$missing")).toThrow(/Undefined variable "\$missing"/);
  });

  it("globals", () => {
    const g = new JsonFx();
    g.defineGlobal("$config", { rate: 2 });
    expect(g.compile("$config.rate * $.n").run({ $: { n: 4 } })).toBe(8);
  });

  it("expressions", () => {
    expect(run("$.items[0]", { $: { items: [7, 8] } })).toBe(7);
    expect(run("$.row[1, 2]", { $: { row: [1, 2, 3] } })).toEqual([2, 3]);
    expect(run("$.user{name, email}", { $: { user: { name: "a", email: "b", pw: "c" } } })).toEqual({ name: "a", email: "b" });
    expect(run("$.'odd key'", { $: { "odd key": 1 } })).toBe(1);
    expect(run("$.items.length", { $: { items: [1, 2] } })).toBe(2);
    expect(run("$.name:trim:toUpperCase", { $: { name: " ab " } })).toBe("AB");
    expect(run("$x * 2 for $x in $.items", { $: { items: [1, 2] } })).toEqual([2, 4]);
    expect(run("{ a: $x, 'b c': 1 }", { $x: 5 })).toEqual({ a: 5, "b c": 1 });
    expect(run("'x' || 'y'")).toBe("x");
    expect(run("-$.x", { $: { x: 5 } })).toBe(-5);
    expect(run("!$.items:length", { $: { items: [] } })).toBe(true);
    expect(run("-2 ** 2")).toBe(4);
  });

  it("null-conditional and parentheses", () => {
    expect(run("$.customer?.address?.city?:toUpperCase", { $: {} })).toBeNull();
    expect(() => run("($.a?.b).c", { $: {} })).toThrow();
  });

  it("conditions and lambdas", () => {
    const t = "'minor' if $.a < 18 else 'senior' if $.a >= 66 else 'adult'";
    expect([16, 30, 70].map(a => run(t, { $: { a } }))).toEqual(["minor", "adult", "senior"]);
    expect(run("$.items:filter($i => $i.active):map($i => $i.id)", { $: { items: [{ id: 1, active: true }, { id: 2, active: false }] } })).toEqual([1]);
    expect(run("$.rows:reduce(($sum, $r) => $sum + $r.amount, 0)", { $: { rows: [{ amount: 1 }, { amount: 2 }] } })).toBe(3);
  });

  it("bare words", () => {
    expect(run("ifElse($.x, yes, no)", { $: { x: true } })).toBe("yes");
    const compiled = fx.compile("ifElse($.x, yes, no)");
    expect(compiled.bareWords.map(b => b.word)).toEqual(["yes", "no"]);
    expect(() => fx.compile("ifElse($.x, yes, no)", { strictIdentifiers: true })).toThrow();
  });

  it("object templates", () => {
    expect(run({
      "// how many days a project runs": "",
      "$day": 86400000,
      "@days($project)": "(($project.end - $project.start) / $day):math~round",
      projects: "$.projects:map($p => { name: $p.name, days: @days($p) })",
      "nickname?": "$.nickname"
    }, { $: { projects: [{ name: "a", start: 0, end: 86400000 * 3 }] } })).toEqual({ projects: [{ name: "a", days: 3 }] });

    expect(run({ "@fact($n)": "1 if $n <= 1 else $n * @fact($n - 1)", "()": "@fact(5)" })).toBe(120);
    expect(run({ "@isBig($n)": "$n >= 100", $numbers: [50, 100, 200], first: "$numbers:find(@isBig)" })).toEqual({ first: 100 });
    expect(run({ "$pi": 3.14159, "@area($r)": "$pi * $r:pow(2)", "()": "@area($)" }, { $: 3 })).toBe(28.27431);
    expect(run({ "{$.prices as $p, $i}": "$p * 2" }, { $: { prices: [5, 6] } })).toEqual({ 5: 10, 6: 12 });
    expect(run({ rectInfo: { area: "@rectArea($.l, $.w)" }, "@rectArea($l, $w)": "$l * $w" }, { $: { l: 2, w: 3 } })).toEqual({ rectInfo: { area: 6 } });
  });

  it("extensions", () => {
    expect(run("$.price:double", { $: { price: 4 } })).toBe(8);
  });

  it("check suggests", () => {
    const report = fx.check("toUppercase($.a)");
    expect(report.findings[0]?.message).toMatch(/Unknown function 'toUppercase'.*toUpperCase/);
  });

  it("security: inherited functions are unreachable, own callbacks work", () => {
    expect(run("$.items:map($.format)", { $: { items: [1, 2], format: (n: number) => "#" + n } })).toEqual(["#1", "#2"]);
    expect(() => run("$.constructor.constructor", { $: {} })).toThrow();
  });
});
