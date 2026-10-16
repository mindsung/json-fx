import { describe, expect, it } from "vitest";
import { createRegistry } from "../stdlib";
import { FxSyntaxError } from "../errors";
import { Scanner } from "./scanner";

const scanner = new Scanner(createRegistry().operatorSymbols());
const kinds = (src: string): string[] => scanner.scan(src).map(t => `${t.kind}:${t.text}`);

describe("scanner", () => {
  it("scans identifiers, variables, templates and namespaced names", () => {
    expect(kinds("$ $a @f math~round foo_1")).toEqual(["var:$", "var:$a", "tpl:@f", "ident:math~round", "ident:foo_1", "eof:"]);
  });

  it("recognizes keywords", () => {
    expect(kinds("true false null undefined if else for in as")).toEqual(
      ["true", "false", "null", "undefined", "if", "else", "for", "in", "as"].map(k => `kw:${k}`).concat("eof:"));
  });

  it("scans numbers, including exponents (B7)", () => {
    const nums = scanner.scan("1 1.5 1e3 1.5e2 2E-2 5e+1").filter(t => t.kind === "num").map(t => t.value);
    expect(nums).toEqual([1, 1.5, 1000, 150, 0.02, 50]);
  });

  it("scans digits after '.' as a property key, not a decimal", () => {
    expect(kinds("$a.0.1")).toEqual(["var:$a", "op:.", "num:0", "op:.", "num:1", "eof:"]);
  });

  it("keeps '-' separate from the number (unary minus)", () => {
    expect(kinds("-1")).toEqual(["op:-", "num:1", "eof:"]);
  });

  it("uses maximal munch for operators", () => {
    expect(kinds("a===b !== c >= d ** e && f || g !! h != i")).toEqual([
      "ident:a", "op:===", "ident:b", "op:!==", "ident:c", "op:>=", "ident:d", "op:**", "ident:e",
      "op:&&", "ident:f", "op:||", "ident:g", "op:!!", "ident:h", "op:!=", "ident:i", "eof:"]);
  });

  it("scans the structural operators", () => {
    expect(kinds("$a?.b?:f ?[0] ?{a} :g")).toEqual([
      "var:$a", "op:?.", "ident:b", "op:?:", "ident:f", "op:?[", "num:0", "punct:]", "op:?{", "ident:a", "punct:}", "op::", "ident:g", "eof:"]);
  });

  it("never merges a quote into an operator (B6)", () => {
    expect(kinds("['a','b']")).toEqual(["punct:[", "str:'a'", "punct:,", "str:'b'", "punct:]", "eof:"]);
    expect(kinds("'a'+'b'")).toEqual(["str:'a'", "op:+", "str:'b'", "eof:"]);
  });

  it("decodes only \\' and \\\\ in strings (B14)", () => {
    const value = (src: string) => scanner.scan(src)[0]?.value;
    expect(value("'it\\'s'")).toBe("it's");
    expect(value("'a\\\\b'")).toBe("a\\b");
    expect(value("'a\\nb'")).toBe("a\\nb");
    expect(value("'C:\\temp'")).toBe("C:\\temp");
  });

  it("scans strings containing structural characters verbatim", () => {
    expect(scanner.scan("'(a, b) => {x}'")[0]?.value).toBe("(a, b) => {x}");
  });

  it("tracks line and column across newlines", () => {
    const tokens = scanner.scan("1 +\n  22");
    expect(tokens[2]).toMatchObject({ kind: "num", line: 2, column: 3 });
  });

  it("rejects an unterminated string", () => {
    expect(() => scanner.scan("'abc")).toThrow(FxSyntaxError);
    expect(() => scanner.scan("'abc\\'")).toThrow(FxSyntaxError);
  });

  it("rejects characters that aren't part of the language", () => {
    for (const src of ["a ? b", "a = b", "#", "`x`", '"x"']) {
      expect(() => scanner.scan(src), src).toThrow(FxSyntaxError);
    }
  });

  it("matches extension operators from the registry", () => {
    const registry = createRegistry([
      { name: "approx", evaluate: (a: number, b: number) => Math.abs(a - b) < 1e-6, operator: { symbol: "<>", precedence: 2 } },
      { name: "pctOf", evaluate: (a: number, b: number) => a / b, operator: { symbol: "%%", precedence: 3.1 } },
      { name: "xor", evaluate: (a: any, b: any) => !a !== !b, operator: { symbol: "xor", precedence: 1 } }
    ]);
    const s = new Scanner(registry.operatorSymbols());
    expect(s.scan("a <> b %% c xor d").map(t => `${t.kind}:${t.text}`)).toEqual(
      ["ident:a", "op:<>", "ident:b", "op:%%", "ident:c", "op:xor", "ident:d", "eof:"]);
  });
});
