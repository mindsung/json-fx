import { describe, expect, it } from "vitest";
import { Random } from "../../test/harness/random";
import { builtinFunctions } from "./index";

/** Every built-in with an inline form must behave exactly like its `evaluate`, for any arguments. */
const withEmit = builtinFunctions.filter(d => d.emit);

const pool: unknown[] = [
  null, undefined, 0, -0, 1, -1, 2.5, NaN, Infinity, 2n, 3n, "", "abc", " a b ", "5", "constructor", true, false,
  [], [1, 2, 3], ["a", "b"], [null, undefined], { a: 1 }, { length: 2 }, new Date(0),
  (x: unknown) => x, (x: unknown) => String(x), () => { throw new Error("boom"); }, (a: number, b: number) => a + b, Symbol.iterator
];

function outcome(f: () => unknown): { ok: true; value: unknown } | { ok: false; error: string } {
  try { return { ok: true, value: f() }; } catch (e) { return { ok: false, error: (e as Error).constructor.name }; }
}

const same = (a: ReturnType<typeof outcome>, b: ReturnType<typeof outcome>): boolean => {
  if (a.ok !== b.ok) { return false; }
  if (!a.ok || !b.ok) { return !a.ok && !b.ok && a.error === b.error; }
  if (a.value instanceof Date && b.value instanceof Date) { return a.value.getTime() === b.value.getTime(); }
  return Object.is(a.value, b.value) || (typeof a.value === "object" && JSON.stringify(a.value) === JSON.stringify(b.value));
};

describe("built-in inline forms (`emit`) match `evaluate`", () => {
  it("covers the plan's inline table", () => {
    const names = withEmit.map(d => d.name);
    for (const n of ["add", "sub", "mul", "div", "mod", "pow", "neg", "eq", "eqq", "neq", "neqq", "gt", "gte", "lt", "lte", "not", "notNot", "length", "math~round", "math~floor", "math~ceil", "math~abs", "math~min", "math~max", "math~sqrt", "toUpperCase", "toLowerCase", "trim"]) {
      expect(names, n).toContain(n);
    }
  });

  // `math~random` is the one non-deterministic built-in; its inline form is the same call.
  for (const def of withEmit.filter(d => d.name !== "math~random")) {
    it(def.name, () => {
      const rand = new Random(7);
      let compared = 0;
      for (let arity = 0; arity <= 4; arity++) {
        const names = Array.from({ length: arity }, (_, i) => `a${i}`);
        const code = def.emit!(names);
        if (code === undefined) { continue; }
        const inlined = new Function(...names, `"use strict"; return ${code};`) as (...a: unknown[]) => unknown;
        for (let i = 0; i < 400; i++) {
          const args = Array.from({ length: arity }, () => rand.pick(pool));
          const expected = outcome(() => def.evaluate!(...args));
          const actual = outcome(() => inlined(...args));
          expect(same(actual, expected), `${def.name}(${args.map(String).join(", ")}) → inline ${JSON.stringify(actual, (_, v) => typeof v === "bigint" ? `${v}n` : v)} vs evaluate ${JSON.stringify(expected, (_, v) => typeof v === "bigint" ? `${v}n` : v)}`).toBe(true);
          compared++;
        }
      }
      expect(compared, `${def.name} has an inline form for no arity`).toBeGreaterThan(0);
    });
  }

  it("evaluates each argument exactly once, in order", () => {
    for (const def of withEmit) {
      for (let arity = 0; arity <= 4; arity++) {
        const names = Array.from({ length: arity }, (_, i) => `a${i}`);
        const code = def.emit!(names);
        if (code === undefined) { continue; }
        for (const n of names) { expect(code.split(n).length - 1, `${def.name}/${arity}: ${n} in ${code}`).toBe(1); }
        const positions = names.map(n => code.indexOf(n));
        expect(positions, `${def.name}/${arity}: ${code}`).toEqual([...positions].sort((a, b) => a - b));
      }
    }
  });
});
