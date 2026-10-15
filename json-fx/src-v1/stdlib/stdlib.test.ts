import { describe, expect, it } from "vitest";
import { FunctionRegistry } from "../api/registry";
import type { FxLazyArg } from "../api/types";
import { FxRuntimeError } from "../errors";
import { builtinFunctions, createRegistry } from ".";

const registry = createRegistry();
const fn = (name: string) => {
  const def = registry.get(name);
  if (!def?.evaluate) { throw new Error(`No built-in "${name}"`); }
  return def.evaluate;
};
const lazy = (f: () => any): FxLazyArg => ({ evaluate: f, sourceRef: { path: "", line: 0, column: 0, symbol: "" } });

describe("built-in registry", () => {
  it("has unique names", () => {
    const names = builtinFunctions.map(d => d.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("registers the operators with v0's symbols and precedences", () => {
    const bin = (s: string) => registry.binaryOperator(s);
    expect([bin("+")?.precedence, bin("*")?.precedence, bin("**")?.precedence, bin("==")?.precedence, bin("&&")?.precedence, bin("||")?.precedence])
      .toEqual([3, 3.1, 3.2, 2, 1.1, 1]);
    expect(bin("**")?.assoc).toBe("right");
    expect(registry.unaryOperator("-")?.def.name).toBe("neg");
    expect(registry.unaryOperator("!")?.def.name).toBe("not");
    expect(registry.unaryOperator("!!")?.def.name).toBe("notNot");
  });

  it("drops v0's stray `funny` operator (B12)", () => {
    expect(registry.has("funny")).toBe(false);
    expect(registry.operatorSymbols()).not.toContain("?");
  });

  it("marks the intrinsic built-ins", () => {
    expect(registry.get("and")?.intrinsic).toBe("and");
    expect(registry.get("or")?.intrinsic).toBe("or");
    expect(registry.get("ifElse")?.intrinsic).toBe("ifElse");
  });

  it("declares impurity exactly where the plan says", () => {
    const impure = builtinFunctions.filter(d => !d.pure).map(d => d.name).sort();
    // `ifElse`, `throw` and `catch` take lazy arguments, so they are never folded either.
    expect(impure).toEqual(["catch", "ifElse", "log", "math~random", "now", "throw"]);
  });

  it("exposes Math as math~name", () => {
    expect(fn("math~PI")()).toBe(Math.PI);
    expect(fn("math~max")(1, 5, 3)).toBe(5);
    expect(registry.has("math~random")).toBe(true);
  });
});

describe("registry", () => {
  it("replaces a definition by name and drops its old operator", () => {
    const r = new FunctionRegistry([{ name: "x", evaluate: () => 1, operator: { symbol: "<>", precedence: 2 } }]);
    r.define({ name: "x", evaluate: () => 2 });
    expect(r.binaryOperator("<>")).toBeUndefined();
    expect(r.get("x")?.evaluate?.()).toBe(2);
  });

  it("rejects invalid names and operator symbols", () => {
    const r = new FunctionRegistry();
    expect(() => r.define({ name: "not valid" })).toThrow();
    expect(() => r.define({ name: "if" })).toThrow(/keyword/);
    for (const symbol of ["'", "a b", "(", "=>", ".", ":", "?:", "$", "~=", "1"]) {
      expect(() => r.define({ name: "op", operator: { symbol, precedence: 1 } }), symbol).toThrow();
    }
  });

  it("accepts symbol and word operators", () => {
    const r = new FunctionRegistry();
    r.define({ name: "a", operator: { symbol: "<>", precedence: 1 } });
    r.define({ name: "b", operator: { symbol: "xor", precedence: 1 } });
    r.define({ name: "c", operator: { symbol: "#", precedence: 0, isUnary: true } });
    expect(r.operatorSymbols().sort()).toEqual(["#", "<>", "xor"]);
  });

  it("keeps `clone()` independent", () => {
    const a = createRegistry();
    const b = a.clone();
    b.define({ name: "extra", evaluate: () => 1 });
    expect(a.has("extra")).toBe(false);
    expect(b.has("extra")).toBe(true);
  });
});

describe("arithmetic, comparative, logical", () => {
  it("evaluates arithmetic", () => {
    expect([fn("add")(1, 2), fn("sub")(1, 2), fn("mul")(2, 3), fn("div")(1, 2), fn("pow")(2, 3), fn("mod")(3, 2), fn("neg")(2)])
      .toEqual([3, -1, 6, 0.5, 8, 1, -2]);
    expect(fn("add")("a", 1)).toBe("a1");
  });

  it("evaluates comparisons", () => {
    expect([fn("eq")(null, undefined), fn("eqq")(null, undefined), fn("neq")(0, 1), fn("neqq")(1, 1)]).toEqual([true, false, true, false]);
    expect([fn("eq")(null, 0), fn("eq")("foo", "bar"), fn("gt")(2, 1), fn("gte")(1, 1), fn("lt")(1, 2), fn("lte")(2, 1)])
      .toEqual([false, false, true, true, true, false]);
  });

  it("evaluates logical functions and returns operands like JS", () => {
    expect([fn("or")(0, "a"), fn("and")(1, "b"), fn("not")(0), fn("notNot")("")]).toEqual(["a", "b", true, false]);
  });
});

describe("conditional", () => {
  it("evaluates ifNull / ifUndefined / ifNullOrUndefined", () => {
    expect([fn("ifNull")(null, "d"), fn("ifNull")(0, "d"), fn("ifNull")(undefined, "d")]).toEqual(["d", 0, undefined]);
    expect([fn("ifUndefined")(undefined, "d"), fn("ifUndefined")(null, "d")]).toEqual(["d", null]);
    expect([fn("ifNullOrUndefined")(null, "d"), fn("ifNullOrUndefined")(undefined, "d"), fn("ifNullOrUndefined")(5, "d")]).toEqual(["d", "d", 5]);
    expect(fn("ifNull")(null, "d", "n")).toBe("d");
    expect(fn("ifNull")(1, "d", "n")).toBe("n");
  });

  it("evaluates only the chosen branch of ifElse", () => {
    const boom = lazy(() => { throw new Error("evaluated"); });
    expect(fn("ifElse")(lazy(() => true), lazy(() => 1), boom)).toBe(1);
    expect(fn("ifElse")(lazy(() => false), boom, lazy(() => 2))).toBe(2);
    expect(fn("ifElse")(lazy(() => false), lazy(() => 1))).toBeUndefined();
  });
});

describe("errors", () => {
  it("throws FxRuntimeError, not a compile error (B16)", () => {
    expect(() => fn("notNull")(null)).toThrow(FxRuntimeError);
    expect(fn("notNull")(0)).toBe(0);
    expect(() => fn("throw")(lazy(() => "boom"))).toThrow(FxRuntimeError);
    expect(() => fn("throw")(lazy(() => "boom"))).toThrow("boom");
  });

  it("catch recovers and is lazy about its fallback", () => {
    const boom = lazy(() => { throw new Error("x"); });
    expect(fn("catch")(boom, lazy(() => "safe"))).toBe("safe");
    expect(fn("catch")(boom)).toBeNull();
    expect(fn("catch")(lazy(() => 1), boom)).toBe(1);
  });
});

describe("collection", () => {
  it("assign / map / reverse / slice / splice / concat", () => {
    expect(fn("assign")({ a: 10, b: 20 }, { a: 5, c: 30 })).toEqual({ a: 5, b: 20, c: 30 });
    expect(fn("map")([2, 4, 8], (i: number) => i - 1)).toEqual([1, 3, 7]);
    const arr = [1, 2, 3];
    expect(fn("reverse")(arr)).toEqual([3, 2, 1]);
    expect(arr).toEqual([1, 2, 3]);
    expect(fn("slice")([0, 1, 2, 3], 1, 3)).toEqual([1, 2]);
    expect(fn("splice")(arr, 1, 1, "x", "y")).toEqual([1, "x", "y", 3]);
    expect(arr).toEqual([1, 2, 3]);
    expect(fn("concat")([0, 1], [2, 3], [4, 5])).toEqual([0, 1, 2, 3, 4, 5]);
    expect(fn("concat")(null, 1, null, [2])).toEqual([1, 2]);
  });

  it("filter works on arrays and objects", () => {
    expect(fn("filter")([1, 2, 3, 4], (i: number) => i % 2 === 0)).toEqual([2, 4]);
    expect(fn("filter")({ a: 1, b: 2 }, (_k: string, v: number) => v > 1)).toEqual({ b: 2 });
    expect(fn("filter")(5, () => true)).toBeUndefined();
  });

  it("reduce / find / findIndex / indexOf / item / first / last / length", () => {
    expect(fn("reduce")([1, 2, 3, 4], (acc: number, i: number) => acc + i, 0)).toBe(10);
    expect(fn("find")([1, 2, 3, 4], (i: number) => i % 2 === 0)).toBe(2);
    expect(fn("findIndex")([5, 6], (i: number) => i === 6)).toBe(1);
    expect(fn("findIndex")([5, 6])).toBeUndefined();
    expect(fn("indexOf")(["a", "b"], "b")).toBe(1);
    expect(fn("indexOf")(null, "b")).toBeUndefined();
    expect(fn("item")([0, 1, 2, 3], 2)).toBe(2);
    expect([fn("first")([1, 2]), fn("last")([1, 2]), fn("first")([]), fn("last")(null)]).toEqual([1, 2, undefined, undefined]);
    expect(fn("length")([0, 1, 2, 3])).toBe(4);
  });

  const data = [{ id: 1, n: "B" }, { id: 0, n: "A" }, { id: 2, n: "C" }];
  it("min / max / findMin / findMax / avg", () => {
    expect([fn("min")([0, 1, 2, 3]), fn("max")([0, 1, 2, 3]), fn("min")([]), fn("max")([null])]).toEqual([0, 3, null, null]);
    expect([fn("min")(data, (i: any) => i.id), fn("max")(data, (i: any) => i.id)]).toEqual([0, 2]);
    expect(fn("findMin")(data, (i: any) => i.id)).toEqual({ id: 0, n: "A" });
    expect(fn("findMax")(data, (i: any) => i.id)).toEqual({ id: 2, n: "C" });
    expect(fn("avg")([0, 1, 2, 3])).toBe(1.5);
    expect(fn("avg")([1, null, 3])).toBe(2);
    expect(fn("avg")([])).toBeNull();
    expect(() => fn("avg")(["a"])).toThrow(/numeric/);
  });

  it("range", () => {
    expect(fn("range")(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(fn("range")(0, 10, 5)).toEqual([0, 5]);
  });

  describe("sort (B13)", () => {
    it("sorts without a key as JS does, and by a key", () => {
      expect(fn("sort")(["bb", "aa", "cc"])).toEqual(["aa", "bb", "cc"]);
      expect(fn("sort")(["bb", "a", "ccc"], (i: string) => i.length)).toEqual(["a", "bb", "ccc"]);
      expect(fn("sort")([10, 9, 1])).toEqual([1, 10, 9]);
      expect(fn("sort")([10, 9, 1], (n: number) => n)).toEqual([1, 9, 10]);
    });

    it("does not mutate its input", () => {
      const arr = [3, 1, 2];
      fn("sort")(arr, (n: number) => n);
      expect(arr).toEqual([3, 1, 2]);
    });

    it("is stable for equal keys, whatever the array size", () => {
      const items = Array.from({ length: 200 }, (_, i) => ({ k: i % 3, i }));
      const sorted = fn("sort")(items, (x: any) => x.k) as typeof items;
      for (let j = 1; j < sorted.length; j++) {
        const a = sorted[j - 1]!;
        const b = sorted[j]!;
        expect(a.k < b.k || (a.k === b.k && a.i < b.i)).toBe(true);
      }
      expect(fn("sort")([5, 4, 3], () => 0)).toEqual([5, 4, 3]);
    });

    it("evaluates the key function once per element", () => {
      let calls = 0;
      fn("sort")([3, 1, 2, 5, 4, 9, 8, 7, 6], (n: number) => { calls++; return n; });
      expect(calls).toBe(9);
    });
  });
});

describe("string", () => {
  it("evaluates the simple functions", () => {
    expect(fn("toString")(1.5)).toBe("1.5");
    expect([fn("substr")("abcdef", 1, 3), fn("substring")("abcdef", 1, 3)]).toEqual(["bcd", "bc"]);
    expect([fn("startsWith")("hello", "he"), fn("endsWith")("hello", "lo"), fn("contains")("hello", "ell"), fn("contains")("hello", "z")])
      .toEqual([true, true, true, false]);
    expect([fn("split")("a,b", ","), fn("join")(["a", "b"], "-")]).toEqual([["a", "b"], "a-b"]);
    expect([fn("toUpperCase")("Hello"), fn("toLowerCase")("Hello")]).toEqual(["HELLO", "hello"]);
    expect([fn("trim")("  a  "), fn("trimLeft")("  a  "), fn("trimRight")("  a  ")]).toEqual(["a", "a  ", "  a"]);
    expect([fn("replace")("a-b-c", "-", "+"), fn("replace")("a-b-c", "-")]).toEqual(["a+b+c", "abc"]);
  });

  it("changes case styles", () => {
    expect(fn("toTitleCase")("hello  big world")).toBe("Hello Big World");
    expect(fn("toSnakeCase")("hello big world")).toBe("hello_big_world");
    expect([fn("toCamelCase")("hello big-world"), fn("toCamelCase")("fooBar baz"), fn("toCamelCase")("")]).toEqual(["helloBigWorld", "fooBarBaz", ""]);
  });
});

describe("time", () => {
  it("formats ISO date-times", () => {
    expect(fn("toISODateTime")("2020-01-02T03:04:05Z")).toBe("2020-01-02T03:04:05.000Z");
    expect(fn("dateTime")("2020-01-02T03:04:05Z")).toEqual(new Date("2020-01-02T03:04:05Z"));
    expect(fn("now")()).toBeInstanceOf(Date);
  });

  it("toISOLocalDateTime formats its first argument, not the current time", () => {
    const f = fn("toISOLocalDateTime");
    expect(f("2020-01-02T03:04:05Z", -60)).toBe("2020-01-02T04:04:05.000+01:00");
    expect(f("2020-01-02T03:04:05Z", 0)).toBe("2020-01-02T03:04:05.000+00:00");
    expect(f("2020-01-02T03:04:05Z", 330)).toBe("2020-01-01T21:34:05.000-05:30");
    expect(f("2020-01-02T03:04:05Z", -570)).toBe("2020-01-02T12:34:05.000+09:30");
  });

  it("toISOLocalDateTime defaults to the host's offset at that date", () => {
    const d = new Date("2020-07-01T12:00:00Z");
    expect(fn("toISOLocalDateTime")(d)).toBe(fn("toISOLocalDateTime")(d, d.getTimezoneOffset()));
  });
});
