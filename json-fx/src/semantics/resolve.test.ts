import { describe, expect, it } from "vitest";
import { createRegistry } from "../stdlib";
import { FxCompileError } from "../errors";
import type { ObjectNode, RefNode } from "../syntax/ast";
import { TemplateReader } from "../syntax/template-reader";
import { resolve, type ResolveOptions } from "./resolve";

const registry = createRegistry();

function run(template: unknown, options: ResolveOptions = {}) {
  const ast = new TemplateReader(registry).read(template);
  const result = resolve(ast, registry, options);
  return { ast, ...result };
}

function compileError(template: unknown, options: ResolveOptions = {}): string {
  try {
    run(template, options);
  } catch (e) {
    expect(e).toBeInstanceOf(FxCompileError);
    return (e as Error).message;
  }
  throw new Error("expected a FxCompileError");
}

describe("resolver: bindings", () => {
  it("binds object variables with slot = declaration order and depth 0 inside the object", () => {
    const { ast } = run({ $a: 1, $b: "$a", x: "$b" });
    const obj = ast as ObjectNode;
    expect(obj.scope?.slots).toBe(2);
    const ref = (obj.decls[1] as { value: RefNode }).value;
    expect(ref.binding).toMatchObject({ kind: "var", slot: 0, name: "$a" });
    expect(ref.depth).toBe(0);
  });

  it("counts only scopes that own a frame when computing depth", () => {
    // The inner object declares nothing (no frame); the lambda has a parameter (frame).
    const { ast } = run({ $v: 1, out: { y: "[1]:map($x => $v + $x)" } });
    const out = ((ast as ObjectNode).fields[0] as { value: ObjectNode }).value;
    expect(out.scope).toBeUndefined();
    // find the `$v` ref inside the lambda body
    const call = (out.fields[0] as { value: any }).value.steps[0].args[0];
    const vRef = call.body.left as RefNode;
    expect(vRef.binding).toMatchObject({ kind: "var", name: "$v" });
    expect(vRef.depth).toBe(1);
  });

  it("shadows: inner declaration wins over outer", () => {
    const { ast } = run({ $a: 1, inner: { $a: 2, v: "$a" }, outer: "$a" });
    const obj = ast as ObjectNode;
    const inner = (obj.fields[0] as { value: ObjectNode }).value;
    const innerRef = (inner.fields[0] as { value: RefNode }).value;
    const outerRef = (obj.fields[1] as { value: RefNode }).value;
    expect(innerRef.binding?.scope).toBe(inner.scope);
    expect(outerRef.binding?.scope).toBe(obj.scope);
  });

  it("binds dynamic-key variables in the field's own scope", () => {
    const { ast } = run({ "{ ['a'] as $v, $k }": "$v + $k" });
    const field = (ast as ObjectNode).fields[0] as { scope?: { slots: number } };
    expect(field.scope?.slots).toBe(2);
  });

  it("binds callable parameters", () => {
    const { ast } = run({ "@twice($x, @f)": "@f(@f($x))", "@inc($n)": "$n + 1", "()": "@twice(1, @inc)" });
    expect((ast as ObjectNode).scope?.slots).toBe(2);
  });

  it("unknown $names are run-time input lookups by default", () => {
    const { ast } = run("$typo + 1");
    const ref = (ast as any).left as RefNode;
    expect(ref.binding).toMatchObject({ kind: "input", name: "$typo" });
  });

  it("globals bind at compile time", () => {
    const { ast } = run("$g", { isGlobal: (n) => n === "$g" });
    expect((ast as RefNode).binding?.kind).toBe("global");
  });
});

describe("resolver: errors", () => {
  it("unknown function in call position suggests alternatives", () => {
    expect(compileError("lowercase($.a)")).toMatch(/Unknown function 'lowercase'.*Did you mean 'toLowerCase'/);
  });

  it("unknown function after ':' and '?:'", () => {
    expect(compileError("$.a:foo()")).toMatch(/Unknown function 'foo'/);
    expect(compileError("$.a?:foo")).toMatch(/Unknown function 'foo'/);
  });

  it("unknown @name suggests visible functions", () => {
    expect(compileError({ "@area($r)": "$r", "()": "@aera(1)" })).toMatch(/Undefined function '@aera'.*Did you mean '@area'/);
  });

  it("reports the source path", () => {
    expect(compileError({ a: { b: "nope(1)" } })).toContain("a.b");
  });

  it("undeclared @ reference outside any scope", () => {
    expect(compileError("@a")).toMatch(/Undefined function '@a'/);
  });

  it("declared inputs turn unknown $names into errors with suggestions", () => {
    expect(compileError("$ordr + 1", { inputs: ["$order"] })).toMatch(/Undefined variable '\$ordr'.*Did you mean '\$order'/);
  });

  it("declared inputs still allow locals, params and globals", () => {
    expect(() => run({ $v: "$ + 1", "()": "[$v]:map($x => $x + $g)" }, { inputs: ["$"], isGlobal: (n) => n === "$g" })).not.toThrow();
  });

  it("strictIdentifiers rejects bare words, with suggestions", () => {
    expect(compileError({ kind: "order" }, { strictIdentifiers: true })).toMatch(/Unknown identifier 'order'/);
    expect(compileError("lenght", { strictIdentifiers: true })).toMatch(/Did you mean 'length'/);
  });

  it("strictIdentifiers keeps registered zero-argument functions and quoted strings", () => {
    expect(() => run("[math~PI, 'order']", { strictIdentifiers: true })).not.toThrow();
  });

  it("records bare words otherwise", () => {
    const { bareWords } = run({ kind: "order", n: "foo + 1" });
    expect(bareWords.map(b => b.word)).toEqual(["order", "foo"]);
  });

  it("detects variable cycles with the cycle path (B11)", () => {
    expect(compileError({ $a: "$b", $b: "$a", "()": "$a" })).toMatch(/\$a → \$b → \$a/);
    expect(compileError({ $a: "$a + 1", "()": "$a" })).toMatch(/Cyclic variable dependency: \$a → \$a/);
    expect(compileError({ $a: "$b", $b: "$c", $c: "[$a]" })).toMatch(/\$a → \$b → \$c → \$a/);
  });

  it("allows recursion through functions and lambdas", () => {
    expect(() => run({ "@f($n)": "ifElse($n <= 0, 0, @f($n - 1))", $v: "@f(3)", "()": "$v" })).not.toThrow();
    expect(() => run({ $a: "[1]:map($x => $a)", "()": "$a" })).not.toThrow();
  });

  it("rejects duplicate parameters", () => {
    expect(compileError("($x, $x) => $x")).toMatch(/declared more than once/);
  });

  it("rejects ifElse/and/or called with the wrong number of arguments", () => {
    expect(compileError("ifElse()")).toMatch(/ifElse/);
    expect(compileError("ifElse(1, 2, 3, 4)")).toMatch(/1 to 3 arguments/);
    expect(compileError("and(1)")).toMatch(/takes 2 arguments/);
  });
});

describe("resolver: warnings", () => {
  it("warns (never errors) when more arguments are given than declared params", () => {
    const reg = createRegistry([{ name: "one", params: [{ name: "x" }], evaluate: (x: unknown) => x }]);
    const ast = new TemplateReader(reg).read("one(1, 2)");
    const { warnings } = resolve(ast, reg);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]!.message).toMatch(/'one' takes at most 1 argument/);
  });
});
