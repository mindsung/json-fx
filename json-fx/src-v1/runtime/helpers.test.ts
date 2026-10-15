import { describe, expect, it } from "vitest";
import { FxCompileError, FxRuntimeError } from "../errors";
import { dynamicEntries, get, getBlocked, getDynamic, index, pick, setOwn, toKey, wrap } from "./helpers";

const src = { path: "a.b", line: 0, column: 0, symbol: "" };

class Greeter {
  public own = 1;
  public greet(): string { return "hi"; }
}

describe("get", () => {
  it("reads data and own functions", () => {
    const fmt = (): string => "x";
    expect(get({ a: 1 }, "a")).toBe(1);
    expect(get({ fmt }, "fmt")).toBe(fmt);
  });

  it("blocks the prototype keys", () => {
    for (const key of ["__proto__", "constructor", "prototype"]) { expect(get({}, key)).toBeUndefined(); }
    expect(get([], "constructor")).toBeUndefined();
  });

  it("an own property that happens to be named like a blocked key is still blocked", () => {
    expect(get(JSON.parse('{"__proto__": 1, "constructor": 2}'), "constructor")).toBeUndefined();
    expect(get(JSON.parse('{"__proto__": 1}'), "__proto__")).toBeUndefined();
  });

  it("blocks inherited functions but not inherited data", () => {
    expect(get(new Greeter(), "greet")).toBeUndefined();
    expect(get(new Greeter(), "own")).toBe(1);
    expect(get(Object.create({ data: 5 }), "data")).toBe(5);
    expect(get([1], "map")).toBeUndefined();
    expect(get("abc", "toString")).toBeUndefined();
    expect(get("abc", "length")).toBe(3);
  });

  it("throws a TypeError for a null or undefined receiver", () => {
    expect(() => get(null, "a")).toThrow(TypeError);
    expect(() => get(undefined, "a")).toThrow(/Cannot read properties of undefined \(reading 'a'\)/);
    expect(() => getBlocked(null, "constructor")).toThrow(TypeError);
    expect(getBlocked({}, "constructor")).toBeUndefined();
  });
});

describe("dynamic keys", () => {
  it("coerces non-primitive keys before the blocked check", () => {
    const sneaky = { toString: () => "constructor" };
    expect(getDynamic({}, sneaky)).toBeUndefined();
    expect(toKey(sneaky)).toBe("constructor");
    expect(toKey(1)).toBe(1);
  });

  it("index returns undefined for blocked keys in a multi-index", () => {
    expect(index({ a: 1 }, ["a", "constructor"])).toEqual([1, undefined]);
  });
});

describe("pick", () => {
  it("copies the listed keys (missing ones are present as undefined, like v0)", () => {
    const result = pick({ a: 1, b: 2 }, ["a", "zz"]);
    expect(result).toEqual({ a: 1, zz: undefined });
    expect(Object.keys(result)).toEqual(["a", "zz"]);
  });

  it("omits blocked keys", () => {
    const result = pick({ a: 1 }, ["a", "constructor", "__proto__", "prototype"]);
    expect(Object.keys(result)).toEqual(["a"]);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it("does not copy inherited functions", () => {
    expect(pick(new Greeter(), ["own", "greet"])).toEqual({ own: 1, greet: undefined });
  });

  it("throws for a null receiver", () => {
    expect(() => pick(null, ["a"])).toThrow(TypeError);
  });
});

describe("setOwn", () => {
  it("defines __proto__ as an own key without touching the prototype", () => {
    const o: Record<string, unknown> = {};
    setOwn(o, "__proto__", { polluted: true });
    expect(Object.keys(o)).toEqual(["__proto__"]);
    expect(Object.getPrototypeOf(o)).toBe(Object.prototype);
    expect(({} as any).polluted).toBeUndefined();
  });
});

describe("dynamicEntries", () => {
  it("expands arrays, objects and scalars", () => {
    expect(dynamicEntries(["a", 2])).toEqual([{ key: "a", value: "a", index: 0 }, { key: "2", value: 2, index: 1 }]);
    expect(dynamicEntries({ x: 1 })).toEqual([{ key: "x", value: 1, index: "x" }]);
    expect(dynamicEntries(5)).toEqual([{ key: "5", value: 5, index: 0 }]);
  });
});

describe("wrap", () => {
  it("wraps foreign errors, keeping the cause and the source path", () => {
    const cause = new TypeError("boom");
    const e = wrap(cause, src);
    expect(e).toBeInstanceOf(FxRuntimeError);
    expect(e.cause).toBe(cause);
    expect(e.message).toContain("boom");
    expect(e.message).toContain("a.b");
  });

  it("keeps the innermost source reference", () => {
    const inner = wrap(new Error("x"), { ...src, path: "inner" });
    expect(wrap(inner, { ...src, path: "outer" })).toBe(inner);
  });

  it("adds a source to a runtime error that has none", () => {
    const e = wrap(new FxRuntimeError("no source"), src);
    expect(e.sourceRef).toBe(src);
    expect(e.message).toContain("a.b");
  });

  it("leaves non-runtime Fx errors alone", () => {
    const c = new FxCompileError("c");
    expect(wrap(c, src)).toBe(c);
  });
});
