import { describe, expect, it, vi } from "vitest";
import { FxRuntimeError } from "../../errors";
import { JsonFx } from "../../api/json-fx";

const calls: Record<string, number> = {};
const fx = new JsonFx({
  functions: [[
    { name: "tick", evaluate: (v: unknown) => { calls["tick"] = (calls["tick"] ?? 0) + 1; return v; } },
    { name: "boom", evaluate: () => { throw new Error("boom"); } }
  ]],
  backend: "closure"
});
const run = (template: unknown, inputs: Record<string, unknown> = {}): any => {
  for (const k of Object.keys(calls)) { delete calls[k]; }
  return fx.compile(template).run(inputs);
};

describe("closure backend: scopes and frames", () => {
  it("variables are lazy and memoized per evaluation", () => {
    expect(run({ $t: "tick(5)", $unused: "boom()", "()": "$t + $t" })).toBe(10);
    expect(calls["tick"]).toBe(1);
  });

  it("each call of a function gets fresh variables", () => {
    expect(run({ "@f($x)": { $y: "tick($x)", "()": "$y + $y" }, "()": "@f(1) + @f(2)" })).toBe(6);
    expect(calls["tick"]).toBe(2);
  });

  it("each evaluation of an object gets fresh variables (lambda body objects)", () => {
    expect(run("[1, 2, 3]:map($x => { $d: tick($x * 2), (): $d + $d })")).toEqual([4, 8, 12]);
    expect(calls["tick"]).toBe(3);
  });

  it("closures capture their defining frame", () => {
    expect(run({ "@adder($n)": "$x => $x + $n", "()": "[1, 2]:map(@adder(10))" })).toEqual([11, 12]);
  });

  it("reaches variables several frames up", () => {
    expect(run({ $a: 1, "()": "[1]:map($x => [2]:map($y => [3]:map($z => $a + $x + $y + $z)))" })).toEqual([[[7]]]);
  });

  it("lambda parameters shadow variables and inputs", () => {
    expect(run({ $x: 100, "()": "[1]:map($x => $x)" }, { $x: 5 })).toEqual([1]);
    expect(run("[1]:map($ => $ + 1)", { $: 50 })).toEqual([2]);
  });

  it("recursion is re-entrant, including deep recursion", () => {
    expect(run({ "@fact($n)": "ifElse($n <= 1, 1, $n * @fact($n - 1))", "()": "@fact(10)" })).toBe(3628800);
    expect(run({ "@sum($n)": "ifElse($n == 0, 0, $n + @sum($n - 1))", "()": "@sum(1000)" })).toBe(500500);
  });

  it("unbounded recursion becomes an FxRuntimeError, not a crash", () => {
    expect(() => run({ "@f($n)": "@f($n + 1)", "()": "@f(0)" })).toThrow(FxRuntimeError);
  });

  it("a cycle that crosses a function is caught at run time", () => {
    expect(() => run({ $a: "@f()", "@f()": "$a", "()": "$a" })).toThrow(/Cyclic reference/);
  });

  it("a failed variable can be retried after catch()", () => {
    const f = new JsonFx({ functions: [[{ name: "flaky", evaluate: (() => { let n = 0; return () => { if (n++ === 0) { throw new Error("first"); } return "ok"; }; })() }]] });
    expect(f.compile({ $v: "flaky()", "()": "[catch($v, 'fallback'), $v]" }).run({})).toEqual(["fallback", "ok"]);
  });

  it("callable parameters accept user functions and host callbacks", () => {
    expect(run({ "@apply(@f, $x)": "@f($x)", "()": "@apply(@dbl, 4)", "@dbl($n)": "$n * 2" })).toBe(8);
    expect(run({ "@apply(@f, $x)": "@f($x)", "()": "@apply($.fmt, 7)" }, { $: { fmt: (n: number) => "#" + n } })).toBe("#7");
  });

  it("calling something that isn't a function is an FxRuntimeError naming it", () => {
    expect(() => run({ "@apply(@f)": "@f(1)", "()": "@apply($.nope)" }, { $: {} })).toThrow(/'@f' is not a function/);
  });
});

describe("closure backend: lambda arguments", () => {
  it("normalizes undefined to null", () => {
    expect(run("[$.a]:map($x => $x == null)", { $: {} })).toEqual([true]);
    expect(run({ "@f($x, $y)": "[$x, $y]", "()": "@f(1)" })).toEqual([1, null]);
  });

  it("ignores surplus arguments", () => {
    expect(run("[5, 6]:map($x => $x)")).toEqual([5, 6]);
  });

  it("receives the index as a second parameter", () => {
    expect(run("['a', 'b']:map(($v, $i) => $v + $i)")).toEqual(["a0", "b1"]);
  });
});

describe("closure backend: chains", () => {
  it("? guards the whole rest of the chain", () => {
    expect(run("$a?.b.c.d", { $a: null })).toBeNull();
    expect(run("$a.b?.c.d", { $a: {} })).toBeNull();
    expect(run("$a?[0].x", { $a: undefined })).toBeNull();
    expect(run("$a?{x}", { $a: null })).toBeNull();
  });

  it("an unguarded null receiver throws", () => {
    expect(() => run("$a.b", { $a: null })).toThrow(FxRuntimeError);
    expect(() => run("$a[0]", { $a: undefined })).toThrow(FxRuntimeError);
    expect(() => run("$a{x}", { $a: null })).toThrow(FxRuntimeError);
  });

  it("an unguarded invoke passes null through to the function", () => {
    expect(run("$a:ifNull('was null')", { $a: null })).toBe("was null");
  });

  it("the receiver of ?: is evaluated once (B1)", () => {
    expect(run("tick($a)?:toUpperCase", { $a: "x" })).toBe("X");
    expect(calls["tick"]).toBe(1);
  });

  it("invokes user functions with the receiver first", () => {
    expect(run({ "@add($a, $b)": "$a + $b", "()": "1:@add(2)" })).toBe(3);
  });

  it("multi-index evaluates every key", () => {
    expect(run("$o[$a, $b]", { $o: { x: 1, y: 2 }, $a: "y", $b: "x" })).toEqual([2, 1]);
  });
});

describe("closure backend: objects", () => {
  it("evaluates keys in order with integer-like keys first (JS ordering)", () => {
    expect(Object.keys(run({ b: 1, 2: 2, a: 3, 1: 4 }))).toEqual(["1", "2", "b", "a"]);
  });

  it("dynamic keys iterate arrays, objects and scalars", () => {
    expect(run({ "{ $.l as $v, $i }": "$v + $i" }, { $: { l: ["a", "b"] } })).toEqual({ a: "a0", b: "b1" });
    expect(run({ "{ $.o as $v, $k }": "$k + $v" }, { $: { o: { x: 1 } } })).toEqual({ x: "x1" });
  });

  it("a dynamic key sees outer variables and its own bindings", () => {
    expect(run({ $suffix: "'!'", "{ ['a', 'b'] as $v }": "$v + $suffix" })).toEqual({ a: "a!", b: "b!" });
  });

  it("optional keys vanish only for null/undefined", () => {
    expect(run({ "a?": "$.a", "b?": "$.b", "c?": "$.c" }, { $: { a: null, b: 0 } })).toEqual({ b: 0 });
  });

  it("output keys can be __proto__ without changing the prototype", () => {
    const out = run(JSON.parse('{"__proto__": {"polluted": true}, "a": 1}'));
    expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    expect(Object.keys(out)).toEqual(["__proto__", "a"]);
    expect(({} as any).polluted).toBeUndefined();
  });

  it("a { source } dynamic key named constructor is an ordinary own key", () => {
    expect(run({ "{ ['constructor'] as $v }": "$v" })).toEqual({ constructor: "constructor" });
  });
});

describe("closure backend: lazy functions", () => {
  it("&& and || short-circuit and return operands", () => {
    expect(run("false && boom()")).toBe(false);
    expect(run("'x' || boom()")).toBe("x");
    expect(run("null || 'y'")).toBe("y");
  });

  it("conditionals evaluate one branch only", () => {
    const fn = vi.fn();
    expect(new JsonFx([{ name: "spy", evaluate: fn }]).compile("1 if true else spy()").run({})).toBe(1);
    expect(fn).not.toHaveBeenCalled();
  });

  it("if/else if/else is right-associative", () => {
    const t = fx.compile("'minor' if $a < 18 else 'senior' if $a >= 66 else 'adult'");
    expect([t.run({ $a: 16 }), t.run({ $a: 30 }), t.run({ $a: 70 })]).toEqual(["minor", "adult", "senior"]);
  });

  it("catch() sees errors from lazily evaluated arguments only", () => {
    expect(run("catch(boom(), 'safe')")).toBe("safe");
    expect(run("catch(1, boom())")).toBe(1);
  });
});
