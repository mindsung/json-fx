import { describe, expect, it } from "vitest";
import { FxCompileError, FxSyntaxError } from "../errors";
import { createRegistry } from "../stdlib";
import { printNode } from "./print";
import { TemplateReader } from "./template-reader";

const reader = new TemplateReader(createRegistry());
const r = (t: unknown): string => printNode(reader.read(t));

describe("template reader", () => {
  it("reads JSON scalars, arrays and expressions", () => {
    expect(r(1)).toBe("1");
    expect(r(true)).toBe("true");
    expect(r(null)).toBe("null");
    expect(r("$ + 1")).toBe("(+ $ 1)");
    expect(r(["$a", 2, { x: "$b" }])).toBe('[$a, 2, {"x"=$b}]');
  });

  it("reads an empty expression as null", () => {
    expect(r("")).toBe("null");
    expect(r({ a: "" })).toBe('{"a"=null}');
  });

  it("skips // comment keys", () => {
    expect(r({ "// note": "ignored", a: 1 })).toBe('{"a"=1}');
  });

  it("uses plain keys verbatim, whatever they look like", () => {
    expect(r({ "first name": 1, "a.b": 2, "x:y": 3, "1": 4 })).toBe('{"1"=4; "first name"=1; "a.b"=2; "x:y"=3}');
  });

  it("reads variable and function declarations", () => {
    expect(r({ $a: 1, "@sq($n)": "$n * $n", "()": "@sq($a)" })).toBe("{$a=1; @sq($n)=(* $n $n); ()=@sq($a)}");
  });

  it("allows declarations next to a `()` output but not fields (compile error)", () => {
    expect(() => reader.read({ "()": 1, a: 2 })).toThrow(FxCompileError);
    expect(() => reader.read({ "()": 1, "{ $x as $v }": 2 })).toThrow(FxCompileError);
    expect(() => reader.read({ "()": 1, $x: 2, "@f": 3 })).not.toThrow();
  });

  it("reads optional keys (B10)", () => {
    expect(r({ "name?": "$.n" })).toBe('{"name"?=chain($ .n)}');
  });

  it("reads a literal key ending in '?' via a constant dynamic key", () => {
    expect(r({ "{ 'name?' }": 1 })).toBe('{["name?"]=1}');
  });

  it("reads dynamic keys (B9)", () => {
    expect(r({ "{ ['A', 'B'] as $v, $i }": "$v + $i" })).toBe('{[["A", "B"] as $v,$i]=(+ $v $i)}');
    expect(r({ "{ $o }": 1 })).toBe("{[$o]=1}");
  });

  it("keeps declaration order of fields", () => {
    expect(r({ first: 1, "{ ['x'] as $v }": "$v", last: 2 })).toBe('{"first"=1; [["x"] as $v]=$v; "last"=2}');
  });

  it("reports the JSON path of a syntax error", () => {
    try {
      reader.read({ lines: [{ total: "1 +" }] });
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(FxSyntaxError);
      expect((e as FxSyntaxError).sourceRef?.path).toBe("lines[0].total");
    }
  });

  it("reports the JSON path of a malformed key", () => {
    expect(() => reader.read({ outer: { "$a b": 1 } })).toThrow(/outer/);
    expect(() => reader.read({ "@f(": 1 })).toThrow(FxSyntaxError);
  });

  it("builds paths for keys that aren't identifiers", () => {
    try {
      reader.read({ "my key": ["ok", "1 +"] });
      expect.unreachable();
    } catch (e) {
      expect((e as FxSyntaxError).sourceRef?.path).toBe('["my key"][1]');
    }
  });
});
