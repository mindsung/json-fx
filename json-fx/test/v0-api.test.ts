import { describe, expect, it, vi } from "vitest";
import {
  JsonFx, type AnyFn, type FxCompiledTemplate, type FxEvaluatorDefinition, type FxExpressionDefinition, type FxInput,
  type FxOperatorDefinition, type FxParamDefinition
} from "../src";

/**
 * 0.x code must be able to switch to 1.x unchanged (README: "Upgrading"). This is 0.x's documented usage, typed with the
 * names its typings exported (the compile-time half is checked by `npm run typecheck`).
 */

describe("0.x public API", () => {
  const op: FxOperatorDefinition = { symbol: "<>", precedence: 2 };
  const param: FxParamDefinition = { name: "n", valueType: "number" };
  const fn: AnyFn = (n: number) => n + 5;
  const evaluator: FxEvaluatorDefinition = { name: "addFive", evaluate: fn, params: [param] };
  const expression: FxExpressionDefinition = { name: "differs", evaluate: (a: any, b: any) => a !== b, operator: op };

  it("constructor with definition arrays, compile(), evaluate(...inputs), clearInputs(), toString(), define()", () => {
    const fx = new JsonFx([evaluator], [expression]);
    const template = {
      "@myRuntimeFunction($a, $b)": "'The answer is: ' + ($a + $b)",
      "$myVar": "'The var is: ' + @myRuntimeFunction($.someInputProp:addFive, 100)",
      someOutputProp: "'The prop is: ' + $myVar",
      differs: "1 <> 2"
    };
    const compiled: FxCompiledTemplate = fx.compile(template);
    const input: FxInput = { name: "$", value: { someInputProp: 10 } };
    expect(compiled.evaluate(input)).toEqual({ someOutputProp: "The prop is: The var is: The answer is: 115", differs: true });
    // inputs persist between evaluate() calls (0.x behaviour) until cleared
    expect(fx.compile("$.n").evaluate({ name: "$", value: { n: 1 } })).toBe(1);
    const stateful = fx.compile("$.n + $k");
    stateful.evaluate({ name: "$", value: { n: 1 } }, { name: "$k", value: 10 });
    expect(stateful.evaluate({ name: "$", value: { n: 2 } })).toBe(12);
    stateful.clearInputs();
    expect(() => stateful.evaluate({ name: "$", value: { n: 2 } })).toThrow(/\$k/);
    expect(typeof compiled.toString()).toBe("string");
    fx.define({ name: "triple", evaluate: (n: number) => n * 3 });
    expect(fx.compile("$:triple").evaluate({ name: "$", value: 2 })).toBe(6);
  });

  it("the package's documented extension shape works: deferEvaluation, params, namespaced names", () => {
    const fx = new JsonFx([{
      name: "my~lazy", deferEvaluation: true, params: [{ name: "a" }],
      evaluate: (a: { evaluate(): any }) => a.evaluate()
    }]);
    expect(fx.compile("my~lazy($.x)").evaluate({ name: "$", value: { x: 4 } })).toBe(4);
  });

  it("`?:` guards a deferEvaluation extension (a null receiver gives null, the function is not called)", () => {
    let calls = 0;
    const fx = new JsonFx([{ name: "my~lazy", deferEvaluation: true, evaluate: (a: { evaluate(): any }, b?: { evaluate(): any }) => { calls++; return [a.evaluate(), b?.evaluate()]; } }]);
    for (const backend of ["closure", "codegen"] as const) {
      const compiled = new JsonFx({ backend, functions: [[{ name: "my~lazy", deferEvaluation: true, evaluate: (a: any, b?: any) => { calls++; return [a.evaluate(), b?.evaluate()]; } }]] }).compile("$.x?:my~lazy($.y)");
      calls = 0;
      expect(compiled.run({ $: { x: null, y: 2 } })).toBeNull();
      expect(calls).toBe(0);
      expect(compiled.run({ $: { x: 1, y: 2 } })).toEqual([1, 2]);
      expect(calls).toBe(1);
    }
    expect(fx.compile("$.x?:my~lazy").evaluate({ name: "$", value: { x: null } })).toBeNull();
  });
});

describe("no logging", () => {
  it("compiling and running templates writes nothing to the console or stdout/stderr (only the `log` function does)", () => {
    const spies = [
      ...(["log", "info", "warn", "error", "debug", "trace"] as const).map(m => vi.spyOn(console, m).mockImplementation(() => undefined)),
      vi.spyOn(process.stdout, "write").mockImplementation(() => true),
      vi.spyOn(process.stderr, "write").mockImplementation(() => true)
    ];
    try {
      const templates: unknown[] = [
        { $a: "$.n * 2", b: "$a", c: "'x' if $a > 3 else yes", "@f($x)": "$x + 1", d: "@f(1)", "nick?": "$.nick", "{$.l as $v}": "$v" },
        "$.l:map($i => $i * 2):sort",
        "unknownFn(1)", "(", { "()": 1, other: 2 }
      ];
      for (const backend of ["auto", "codegen", "closure"] as const) {
        const fx = new JsonFx({ backend });
        for (const t of templates) {
          try { fx.compile(t).run({ $: { n: 2, l: [1, 2], nick: null } }); } catch { /* errors are returned to the caller, not logged */ }
          try { fx.check(t); } catch { /* same */ }
        }
      }
      for (const spy of spies) { expect(spy).not.toHaveBeenCalled(); }
      new JsonFx().compile("log('x', 1)").run({});
      expect(spies[0]).toHaveBeenCalledTimes(1);
    } finally {
      spies.forEach(s => s.mockRestore());
    }
  });
});
