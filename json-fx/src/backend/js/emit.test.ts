import { describe, expect, it } from "vitest";
import { HOSTILE_FRAGMENTS, hostileString, Random } from "../../../test/harness/random";
import { factoryName, inline, keyLiteral, literal, member, Names, num, propKey, sanitizeName, str } from "./emit";

const evalExpr = (expr: string, ...args: unknown[]): any => new Function("o", `"use strict"; return ${expr};`)(...args);

const samples = (): string[] => {
  const rand = new Random(12345);
  const out = [...HOSTILE_FRAGMENTS, "", "x".repeat(100_000), HOSTILE_FRAGMENTS.join(""), "\u2028\u2029".repeat(50)];
  for (let i = 0; i < 3000; i++) { out.push(hostileString(rand, 12)); }
  return out;
};

describe("emit: strings and keys (fuzz with hostile text)", () => {
  it("str() round-trips and contains nothing that can end a literal or a script", () => {
    for (const s of samples()) {
      const lit = str(s);
      expect(evalExpr(lit)).toBe(s);
      expect([...lit].filter(c => "\n\r<>&".includes(c) || c.charCodeAt(0) === 0x2028 || c.charCodeAt(0) === 0x2029)).toEqual([]);
    }
  });

  it("propKey() gives an own property and never changes the prototype", () => {
    for (const k of samples()) {
      const o = evalExpr(`({ ${propKey(k)}: 1, other: 2 })`);
      expect(Object.getPrototypeOf(o)).toBe(Object.prototype);
      expect(Object.keys(o)).toEqual(k === "other" ? ["other"] : [k, "other"]);
      expect(Object.getOwnPropertyDescriptor(o, k)?.value).toBe(k === "other" ? 2 : 1);
    }
  });

  it("member() reads exactly the named own property", () => {
    for (const k of samples().slice(0, 500)) {
      const o = Object.create(null);
      Object.defineProperty(o, k, { value: "found", enumerable: true });
      expect(evalExpr(member("o", k), o)).toBe("found");
    }
    expect(evalExpr(member("o", 3), [0, 1, 2, "three"])).toBe("three");
  });

  it("keyLiteral() and literal() round-trip every kind of value", () => {
    for (const v of [0, -0, 1, -1, 1.5, -1.5, 1e21, 1e-7, 5e-324, Number.MAX_VALUE, -Number.MAX_VALUE, NaN, Infinity, -Infinity]) {
      expect(Object.is(evalExpr(num(v)), v), String(v)).toBe(true);
      expect(Object.is(evalExpr(literal(v)), v)).toBe(true);
    }
    expect(evalExpr(literal(null))).toBe(null);
    expect(evalExpr(literal(undefined))).toBe(undefined);
    expect(evalExpr(literal(true))).toBe(true);
    expect(evalExpr(literal(false))).toBe(false);
    expect(evalExpr(keyLiteral(7))).toBe(7);
    expect(evalExpr(`(${num(-1)}).toFixed(1)`)).toBe("-1.0");
  });

  it("template names can't break out of the generated function name or the sourceURL comment", () => {
    const names = [undefined, "", ...samples().slice(0, 800)];
    for (const n of names) {
      expect(sanitizeName(n)).toMatch(/^[A-Za-z0-9_.-]+$/);
      expect(factoryName(n)).toMatch(/^template_[A-Za-z0-9_]*$/);
      expect(() => new Function(`return function ${factoryName(n)}() {}`)).not.toThrow();
    }
  });

  it("Names produce unique identifiers", () => {
    const names = new Names();
    const ids = new Set(Array.from({ length: 1000 }, (_, i) => names.id(i % 2 ? "p" : "v")));
    expect(ids.size).toBe(1000);
  });
});

describe("emit: inline builders", () => {
  it("decline an argument count they don't match", () => {
    expect(inline.binary("+")(["a"])).toBeUndefined();
    expect(inline.unary("!")(["a", "b"])).toBeUndefined();
    expect(inline.method("trim")([])).toBeUndefined();
    expect(inline.property("length")(["a", "b"])).toBeUndefined();
    expect(inline.mathConstant("PI")(["a"])).toBeUndefined();
  });

  it("parenthesize number receivers", () => {
    expect(evalExpr(inline.method("toString")(["5"]) as string)).toBe("5");
    expect(evalExpr(inline.property("length")([str("abc")]) as string)).toBe(3);
  });
});
