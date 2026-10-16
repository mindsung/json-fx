import { describe, expect, it } from "vitest";
import { JsonFx } from "../../api/json-fx";
import { FxRuntimeError } from "../../errors";
import { HOSTILE_FRAGMENTS, hostileString, Random } from "../../../test/harness/random";

const closure = new JsonFx({ backend: "closure" });
const codegen = new JsonFx({ backend: "codegen" });

type Outcome = { value: unknown } | { error: FxRuntimeError };

function run(fx: JsonFx, template: unknown, inputs: Record<string, unknown>): Outcome {
  try { return { value: fx.compile(template, { name: "t" }).run(inputs) }; } catch (error) { return { error: error as FxRuntimeError }; }
}

/** Built-ins name their parameters in "str.toUpperCase is not a function" (V8 prints the callee text); generated code can't. */
const normalize = (m: string): string => m.replace(/(?:value|[A-Za-z_$][\w$]*)\.(\w+) is not a function/g, "<callee>.$1 is not a function");

/** Runs on both backends, asserts they agree (value or error message and path) and returns the codegen outcome. */
function both(template: unknown, inputs: Record<string, unknown> = {}): Outcome {
  const a = run(closure, template, inputs);
  const b = run(codegen, template, inputs);
  if ("error" in a || "error" in b) {
    expect("error" in b && "error" in a, "both must throw").toBe(true);
    const ea = (a as { error: FxRuntimeError }).error;
    const eb = (b as { error: FxRuntimeError }).error;
    expect([eb.name, normalize(eb.message), eb.sourceRef]).toEqual([ea.name, normalize(ea.message), ea.sourceRef]);
  } else {
    expect(b.value).toEqual(a.value);
  }
  return b;
}

const value = (o: Outcome): unknown => {
  if ("error" in o) { throw o.error; }
  return o.value;
};
const message = (o: Outcome): string => ("error" in o ? o.error.message : "(no error)");

describe("codegen: error attribution matches the closure backend (innermost source reference wins)", () => {
  it("a field", () => {
    expect(message(both({ a: { b: "$.x.y" } }, { $: {} }))).toMatch(/at a\.b/);
  });

  it("an array item reports the item, not the enclosing field", () => {
    expect(message(both({ list: ["1", "$.x.y"] }, { $: {} }))).toMatch(/at list\[1\]/);
  });

  it("nested literals report the innermost field", () => {
    expect(message(both({ a: [{ b: [1, "$.n:toUpperCase"] }] }, { $: { n: 1 } }))).toMatch(/at a\[0\]\.b\[1\]/);
  });

  it("a function body reports the function's own path, not its caller's", () => {
    expect(message(both({ "@f($x)": "$x.a.b", "r": "@f($.v)" }, { $: { v: {} } }))).toMatch(/at \["@f\(\$x\)"\]/);
  });

  it("a variable reports its own declaration", () => {
    expect(message(both({ "$v": "$.x.y", "r": "$v" }, { $: {} }))).toMatch(/at \$v/);
  });

  it("an error recovered by catch() doesn't leave a stale reference for the next error", () => {
    // The first call fails inside a lazy argument and is swallowed; the second failure belongs to the field `r`.
    const o = both({ r: "add(catch($.x.y, 1), $.p.q)", other: [0, 1] }, { $: {} });
    expect(message(o)).toMatch(/at r/);
  });

  it("an error recovered inside an array item doesn't leak into the next item", () => {
    expect(message(both({ list: [{ ok: "catch($.x.y, 1)" }, "$.p.q"] }, { $: {} }))).toMatch(/at list\[1\]/);
  });

  it("a non-tail literal (call argument) is wrapped by the call's own field", () => {
    expect(message(both({ r: "concat([$.x.y], $.a)" }, { $: { a: [1] } }))).toMatch(/at r\b/);
    expect(message(both({ r: "concat([1], [$.x.y])" }, { $: { a: [1] } }))).toMatch(/at r\b/);
  });

  it("an undeclared input keeps its own reference", () => {
    expect(message(both({ r: "$missing + 1" }, {}))).toMatch(/Undefined variable "\$missing" \(at r/);
  });
});

describe("codegen: evaluation order of errors", () => {
  it("arguments are evaluated before the receiver is dereferenced (which error wins)", () => {
    expect(message(both("$.nul:map($missing)", { $: { nul: null } }))).toMatch(/Undefined variable/);
    expect(message(both("$.nul:join($missing)", { $: { nul: null } }))).toMatch(/Undefined variable/);
  });

  it("the callee of @f() is checked before its arguments", () => {
    expect(message(both({ "@g(@f)": "@f(1 + $.nul.x)", "r": "@g(5)" }, { $: { nul: null } }))).toMatch(/'@f' is not a function/);
  });
});

describe("codegen: variables and functions", () => {
  it("a variable that threw can be read again (state is reset)", () => {
    expect(value(both({ "$v": "$.nul.x", "a": "catch($v, 1)", "b": "catch($v, 2)" }, { $: { nul: null } }))).toEqual({ a: 1, b: 2 });
  });

  it("a cycle through a function is detected at run time", () => {
    const o = both({ "@f()": "$v", "$v": "@f()", "()": "$v" });
    expect(message(o)).toMatch(/Cyclic reference/);
  });

  it("recursion and mutual recursion", () => {
    expect(value(both({ "@fact($n)": "ifElse($n <= 1, 1, $n * @fact($n - 1))", "()": "@fact($)" }, { $: 6 }))).toBe(720);
    expect(value(both({ "@even($n)": "ifElse($n == 0, true, @odd($n - 1))", "@odd($n)": "ifElse($n == 0, false, @even($n - 1))", "()": "@even($)" }, { $: 7 }))).toBe(false);
  });

  it("a variable is computed once per run, and again in the next run", () => {
    let ticks = 0;
    const fx = new JsonFx({ backend: "codegen", functions: [[{ name: "tick", evaluate: () => ++ticks }]] });
    const t = fx.compile({ "$t": "tick()", "()": "$t + $t" });
    expect(t.run({})).toBe(2);
    expect(t.run({})).toBe(4);
    expect(ticks).toBe(2);
  });

  it("lambdas capture the variables of their object", () => {
    expect(value(both({ "$k": 10, "r": "$.a:map($x => $x * $k)" }, { $: { a: [1, 2] } }))).toEqual({ r: [10, 20] });
  });

  it("missing lambda arguments are null, as in the closure backend", () => {
    expect(value(both({ "@f($a, $b)": "[$a, $b]", "r": "@f(1)" }))).toEqual({ r: [1, null] });
  });
});

describe("codegen: hostile keys and literals", () => {
  it("keys and string constants are data, never code", () => {
    const rand = new Random(99);
    const strings = [...HOSTILE_FRAGMENTS, ...Array.from({ length: 300 }, () => hostileString(rand, 10))];
    for (const raw of strings) {
      const quoted = "'" + raw.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
      const key = "k" + raw.replace(/\?$/, "x");
      if (/[\r\n]/.test(raw)) { continue; }
      const template = JSON.parse(JSON.stringify({ [key]: quoted, "plain": 1 }));
      const o = both(template, {});
      expect(value(o)).toEqual({ [key]: raw, plain: 1 });
    }
  });

  it("dynamic keys from input data can be anything, including __proto__", () => {
    const input = JSON.parse("{\"__proto__\": 1, \"constructor\": 2, \"a'b\": 3, \"</script>\": 4}");
    const out = value(both({ "{ $ as $v, $k }": "$k + '=' + $v" }, { $: input })) as Record<string, string>;
    expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    expect(Object.keys(out).sort()).toEqual(["</script>", "__proto__", "a'b", "constructor"]);
    expect(Object.getOwnPropertyDescriptor(out, "__proto__")?.value).toBe("__proto__=1");
  });

  it("an own __proto__ key in the template is an own key of the output", () => {
    const template = JSON.parse("{\"__proto__\": \"1 + 1\", \"a\": 1}");
    const out = value(both(template)) as Record<string, unknown>;
    expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(out, "__proto__")?.value).toBe(2);
  });

  it("hostile input keys can't reach host code through reads", () => {
    const o = value(both("[$.__proto__, $.constructor, $.hasOwnProperty, $['constructor'], $[$k]]", { $: {}, $k: "constructor" }));
    expect(o).toEqual([undefined, undefined, undefined, undefined, undefined]);
  });

  it("the template name is only ever a comment and a function name", () => {
    const name = "x */ ; throw new Error('pwned') ; /* \n //";
    const t = codegen.compile("$ + 1", { name });
    expect(t.run({ $: 1 })).toBe(2);
    // The name can't start a new line of code (or end the sourceURL comment) in the generated source.
    expect(t.source?.split("\n").filter(l => /^\s*throw new Error\('pwned/.test(l) || l.includes("*/ ;"))).toEqual([]);
    expect(t.source?.split("\n").filter(l => l.startsWith("//#"))).toHaveLength(1);
  });
});

describe("codegen: scale", () => {
  it("a wide object", () => {
    const template: Record<string, unknown> = {};
    for (let i = 0; i < 2000; i++) { template[`k${i}`] = `$ + ${i}`; }
    const out = value(both(template, { $: 1 })) as Record<string, number>;
    expect(out["k1999"]).toBe(2000);
  });

  it("deep nesting", () => {
    let template: unknown = "$";
    for (let i = 0; i < 150; i++) { template = { n: template }; }
    let out = value(both(template, { $: 7 })) as any;
    for (let i = 0; i < 150; i++) { out = out.n; }
    expect(out).toBe(7);
  });

  it("a long arithmetic chain", () => {
    expect(value(both(Array.from({ length: 400 }, () => "1").join(" + ")))).toBe(400);
  });
});
