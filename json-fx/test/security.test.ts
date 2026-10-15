import { afterEach, describe, expect, it } from "vitest";
import { JsonFx } from "../src-v1";

/** V1-PLAN.md §3.3 / §4.6: what the default hardening must hold, independent of the corpus. */

const fx = new JsonFx({ backend: "closure" });
const run = (template: unknown, inputs: Record<string, unknown> = {}): any => fx.compile(template).run(inputs);

afterEach(() => { delete (globalThis as any).__pwned; });

describe("§3.3 constructor gadget", () => {
  const payload = { $F: "$.constructor.constructor", $made: "['(globalThis.__pwned = 1, typeof process)']:max($F)", "()": "[1]:max($made)" };

  it("does not execute template-supplied code", () => {
    expect(() => run(payload, { $: {} })).toThrow();
    expect((globalThis as any).__pwned).toBeUndefined();
  });

  it("is blocked at every way of spelling the key", () => {
    for (const template of [
      "$.constructor.constructor",
      "$['constructor']['constructor']",
      "$[$k][$k]",
      "$.'constructor'.constructor",
      "'x'.constructor.constructor",
      "[].constructor.constructor",
      "$.items.map.constructor",
      "$:toString.constructor.constructor"
    ]) {
      expect(() => run(template, { $: { items: [] }, $k: "constructor" }), template).toThrow();
    }
  });

  it("a key that coerces to 'constructor' is still blocked", () => {
    const sneaky = { toString: () => "constructor" };
    expect(run("$o[$k]", { $o: {}, $k: sneaky })).toBeUndefined();
  });

  it("__proto__ and prototype reads are undefined", () => {
    expect(run("$.__proto__", { $: {} })).toBeUndefined();
    expect(run("$['__proto__']", { $: {} })).toBeUndefined();
    expect(run("$.prototype", { $: { prototype: 1 } })).toBeUndefined();
    expect(() => run("$.__proto__.x", { $: {} })).toThrow();
  });
});

describe("inherited vs own functions", () => {
  it("blocks inherited methods", () => {
    expect(run("$.items.map", { $: { items: [1] } })).toBeUndefined();
    expect(run("$.toString", { $: {} })).toBeUndefined();
    expect(run("$.hasOwnProperty", { $: {} })).toBeUndefined();
  });

  it("allows own function properties (host callbacks)", () => {
    expect(run("$.items:map($.fmt)", { $: { items: [1, 2], fmt: (n: number) => "#" + n } })).toEqual(["#1", "#2"]);
  });

  it("blocks functions inherited through a prototype chain", () => {
    const o = Object.create({ inherited: () => 1 });
    expect(run("$.inherited", { $: o })).toBeUndefined();
  });

  it("stdlib functions that take a template-controlled key use the hardened read", () => {
    expect(run("item($, 'constructor')", { $: {} })).toBeUndefined();
    expect(run("$:item($k)", { $: {}, $k: "__proto__" })).toBeUndefined();
    expect(() => run("$:item('constructor'):item('constructor')", { $: {} })).toThrow();
    expect(run("$:item(1)", { $: [1, 2] })).toBe(2);
  });

  it("assign and filter copy an own __proto__ key as data", () => {
    const evil = JSON.parse('{"__proto__": {"isAdmin": true}, "a": 1}');
    const assigned = run("assign({}, $)", { $: evil });
    expect(assigned.isAdmin).toBeUndefined();
    expect(Object.getPrototypeOf(assigned)).toBe(Object.prototype);
    const filtered = run("$:filter(($k, $v) => true)", { $: evil });
    expect(filtered.isAdmin).toBeUndefined();
    expect(Object.getPrototypeOf(filtered)).toBe(Object.prototype);
  });
});

describe("pick / index / dynamic keys never write the prototype", () => {
  it("pick omits blocked keys", () => {
    const out = run("$o{a, constructor, __proto__, prototype}", { $o: { a: 1 } });
    expect(Object.keys(out)).toEqual(["a"]);
    expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
  });

  it("pick with a dynamic blocked key is omitted too", () => {
    const out = run("$o{a, $k}", { $o: { a: 1 }, $k: "__proto__" });
    expect(Object.keys(out)).toEqual(["a"]);
  });

  it("an input that owns a __proto__ key is not copied into the prototype", () => {
    const evil = JSON.parse('{"__proto__": {"polluted": true}, "a": 1}');
    const out = run({ "{ $.o as $v, $k }": "$v" }, { $: { o: evil } });
    expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    expect(out.polluted).toBeUndefined();
    expect(({} as any).polluted).toBeUndefined();
  });

  it("multi-index returns undefined for blocked keys", () => {
    expect(run("$o['a', 'constructor']", { $o: { a: 1 } })).toEqual([1, undefined]);
  });

  it("static output key __proto__ is an own key", () => {
    const out = run(JSON.parse('{"__proto__": 1, "a": 2}'));
    expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    expect(Object.keys(out)).toEqual(["__proto__", "a"]);
  });
});

describe("hostile literals and keys round-trip as data", () => {
  it("never become code", () => {
    const keys = ["a\"b", "back\\slash", "tick`s", "a${globalThis.__pwned=1}", "*/", "</script>", " ", "x\ny", "'single'"];
    const template = Object.fromEntries(keys.map((k, i) => [k, i]));
    expect(run(template)).toEqual(template);
    expect(run(["'a\"b'", "'`${globalThis.__pwned=1}`'", "'*/ //'", "' '"])).toEqual(["a\"b", "`${globalThis.__pwned=1}`", "*/ //", " "]);
    expect((globalThis as any).__pwned).toBeUndefined();
  });
});

describe("user functions can't be used to reach host objects", () => {
  it("function values handed out by a template are its own closures", () => {
    const f = run({ "@f($x)": "$x", "()": "@f" });
    expect(typeof f).toBe("function");
    // Even a returned closure exposes nothing through the template language afterwards.
    expect(run("$.f.constructor", { $: { f } })).toBeUndefined();
  });
});
