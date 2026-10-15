import { describe, expect, it, vi } from "vitest";
import { FxCompileError, FxRuntimeError, FxSyntaxError } from "../errors";
import { JsonFx } from "./json-fx";

const fx = new JsonFx();
const run = (template: unknown, inputs: Record<string, unknown> = {}): any => fx.compile(template).run(inputs);

describe("JsonFx.compile / run", () => {
  it("run() is pure: nothing leaks between calls", () => {
    const t = fx.compile("$ + 1");
    expect(t.run({ $: 1 })).toBe(2);
    expect(t.run({ $: 10 })).toBe(11);
    expect(() => t.run({})).toThrow(/Undefined variable "\$"/);
  });

  it("throws the right error class in the right phase", () => {
    expect(() => fx.compile("1 +")).toThrow(FxSyntaxError);
    expect(() => fx.compile("nope(1)")).toThrow(FxCompileError);
    expect(() => run("$a.b.c", { $a: {} })).toThrow(FxRuntimeError);
  });

  it("carries the template name and the source path on runtime errors", () => {
    const t = fx.compile({ outer: { inner: "$.a.b" } }, { name: "order" });
    let error: any;
    try { t.run({ $: {} }); } catch (e) { error = e; }
    expect(error).toBeInstanceOf(FxRuntimeError);
    expect(error.templateName).toBe("order");
    expect(error.message).toContain("outer.inner");
    expect(error.cause).toBeInstanceOf(TypeError);
  });

  it("wraps a failing function with the path of the field that called it", () => {
    let error: any;
    try { run({ a: 1, b: { c: "throw('boom')" } }); } catch (e) { error = e; }
    expect(error.message).toContain("boom");
    expect(error.message).toContain("b.c");
  });

  it("an error inside a user function reports the function's own path", () => {
    let error: any;
    try { run({ "@f($x)": "$x.a.b", "()": "@f({})" }); } catch (e) { error = e; }
    expect(error).toBeInstanceOf(FxRuntimeError);
    expect(error.message).toContain("@f($x)");
  });

  it("exposes warnings and bare words", () => {
    const t = fx.compile({ kind: "order" });
    expect(t.bareWords.map(b => b.word)).toEqual(["order"]);
    expect(t.warnings).toEqual([]);
  });

  it("the codegen backend isn't available yet", () => {
    expect(() => fx.compile("1", { backend: "codegen" })).toThrow(FxCompileError);
    expect(fx.compile("1", { backend: "closure" }).run({})).toBe(1);
    expect(() => new JsonFx({ backend: "codegen" }).compile("1")).toThrow(FxCompileError);
    expect(new JsonFx({ backend: "auto" }).compile("1").run({})).toBe(1);
  });
});

describe("evaluate / clearInputs (v0 compatible)", () => {
  it("inputs persist across calls until cleared", () => {
    const t = fx.compile("$a + $b");
    expect(t.evaluate({ name: "$a", value: 1 }, { name: "$b", value: 2 })).toBe(3);
    expect(t.evaluate({ name: "$a", value: 10 })).toBe(12);
    t.clearInputs();
    expect(() => t.evaluate({ name: "$a", value: 1 })).toThrow(/Undefined variable "\$b"/);
  });

  it("instances don't share retained inputs", () => {
    const a = fx.compile("$");
    const b = fx.compile("$");
    a.evaluate({ name: "$", value: 1 });
    expect(() => b.evaluate()).toThrow(/Undefined variable/);
  });
});

describe("extensions", () => {
  it("accepts definition sets like v0", () => {
    const f = new JsonFx([{ name: "addFive", evaluate: (n: number) => n + 5 }]);
    expect(f.compile("addFive($)").run({ $: 1 })).toBe(6);
    expect(f.compile("$:addFive").run({ $: 1 })).toBe(6);
  });

  it("accepts an options object", () => {
    const f = new JsonFx({ functions: [[{ name: "addFive", evaluate: (n: number) => n + 5 }]] });
    expect(f.compile("addFive($)").run({ $: 1 })).toBe(6);
  });

  it("supports extension operators", () => {
    const f = new JsonFx([{ name: "pow3", evaluate: (a: number, b: number) => a ** b, operator: { symbol: "^^", precedence: 3.3 } }]);
    expect(f.compile("2 ^^ 3").run({})).toBe(8);
  });

  it("supports deferEvaluation extensions with sourceRef", () => {
    const seen: string[] = [];
    const f = new JsonFx([{
      name: "twice", deferEvaluation: true,
      evaluate: (a: { evaluate(): number; sourceRef: { path: string } }) => { seen.push(a.sourceRef.path); return a.evaluate() * 2; }
    }]);
    expect(f.compile({ x: "twice($ + 1)" }).run({ $: 1 })).toEqual({ x: 4 });
    expect(seen).toEqual(["x"]);
  });

  it("define() after compile() doesn't affect existing templates", () => {
    const f = new JsonFx();
    expect(() => f.compile("late(1)")).toThrow(FxCompileError);
    f.define({ name: "late", evaluate: (n: number) => n + 1 });
    expect(f.compile("late(1)").run({})).toBe(2);

    const t = f.compile("late(1)");
    f.define({ name: "late", evaluate: () => 999 });
    expect(t.run({})).toBe(2);
    expect(f.compile("late(1)").run({})).toBe(999);
  });

  it("a redefined built-in replaces the old one", () => {
    const f = new JsonFx([{ name: "length", evaluate: () => "mine" }]);
    expect(f.compile("[1]:length").run({})).toBe("mine");
  });

  it("extension functions are impure by default: called per evaluation", () => {
    const tick = vi.fn((v: unknown) => v);
    const f = new JsonFx([{ name: "tick", evaluate: tick }]);
    const t = f.compile("tick(1)");
    t.run({}); t.run({});
    expect(tick).toHaveBeenCalledTimes(2);
  });
});

describe("defineGlobal", () => {
  it("binds at compile time and reads the value at run time", () => {
    const f = new JsonFx();
    f.defineGlobal("$rate", 2);
    const t = f.compile("$ * $rate");
    expect(t.run({ $: 5 })).toBe(10);
    f.defineGlobal("$rate", 3);
    expect(t.run({ $: 5 })).toBe(15);
  });

  it("is not bound for templates compiled before it existed", () => {
    const f = new JsonFx();
    const t = f.compile("$late");
    f.defineGlobal("$late", 1);
    expect(() => t.run({})).toThrow(/Undefined variable "\$late"/);
    expect(f.compile("$late").run({})).toBe(1);
  });

  it("is shadowed by locals and declared inputs", () => {
    const f = new JsonFx();
    f.defineGlobal("$x", "global");
    expect(f.compile({ $x: "'local'", "()": "$x" }).run({})).toBe("local");
    expect(f.compile("$x", { inputs: ["$x"] }).run({ $x: "input" })).toBe("input");
  });

  it("passes declared-inputs checking", () => {
    const f = new JsonFx();
    f.defineGlobal("$g", 1);
    expect(f.compile("$ + $g", { inputs: ["$"] }).run({ $: 1 })).toBe(2);
  });

  it("validates the name", () => {
    expect(() => new JsonFx().defineGlobal("nope" as any, 1)).toThrow(/Invalid global name/);
  });
});
