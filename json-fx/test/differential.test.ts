import { describe, expect, it } from "vitest";
import { JsonFx } from "../src-v1";
import { randomCase } from "./harness/random-template";

/**
 * Differential test (V1-PLAN.md Phase 4): random templates × random inputs must give the same value or the same error
 * on the closure backend (the semantic reference) and on the code generator.
 *
 *   DIFF_CASES=100000 npx vitest run test/differential.test.ts      the release-gate run
 *   DIFF_SEED=<n> DIFF_CASES=1 …                                      replay one case (seeds are printed on failure)
 */
const CASES = Number(process.env["DIFF_CASES"] ?? 4000);
const FIRST_SEED = Number(process.env["DIFF_SEED"] ?? 1);
const MAX_REPORTED = 5;

type Outcome = { ok: true; value: unknown } | { ok: false; error: unknown };

function attempt(f: () => unknown): Outcome {
  try { return { ok: true, value: f() }; } catch (error) { return { ok: false, error }; }
}

/** Built-ins name their parameters in "arr.map is not a function" (V8 prints the callee text); generated code can't. */
const normalizeMessage = (m: string): string => m.replace(/(?:value|[A-Za-z_$][\w$]*)\.(\w+) is not a function/g, "<callee>.$1 is not a function");

function describeError(e: unknown): string {
  const err = e as { constructor?: { name?: string }; message?: string; cause?: unknown; templateName?: string; sourceRef?: unknown };
  const cause = err.cause as { constructor?: { name?: string } } | undefined;
  return JSON.stringify([err.constructor?.name, normalizeMessage(String(err.message)), cause?.constructor?.name ?? null, err.templateName ?? null, err.sourceRef ?? null]);
}

/** Structural equality that tells -0 from 0, keeps NaN equal to itself and checks prototypes and own-key order. */
function difference(a: unknown, b: unknown, path = "$"): string | null {
  if (Object.is(a, b)) { return null; }
  if (typeof a !== typeof b) { return `${path}: ${typeof a} vs ${typeof b}`; }
  if (typeof a === "function") { return null; }
  if (typeof a !== "object" || a === null || b === null) { return `${path}: ${String(a)} vs ${String(b)}`; }
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b as object)) { return `${path}: different prototypes`; }
  if (a instanceof Date) { return a.getTime() === (b as Date).getTime() ? null : `${path}: dates differ`; }
  const ka = Reflect.ownKeys(a);
  const kb = Reflect.ownKeys(b as object);
  if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) { return `${path}: keys ${String(ka.map(String))} vs ${String(kb.map(String))}`; }
  for (const k of ka) {
    const d = difference((a as Record<PropertyKey, unknown>)[k], (b as Record<PropertyKey, unknown>)[k], `${path}.${String(k)}`);
    if (d) { return d; }
  }
  return null;
}

function safeJson(v: unknown): string {
  try { return JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? `${x}n` : x === undefined ? "$$undefined" : x)); } catch { return String(v); }
}

describe("differential: closure vs codegen", () => {
  it(`agree on ${CASES} random templates (seeds ${FIRST_SEED}…${FIRST_SEED + CASES - 1})`, () => {
    const closure = new JsonFx({ backend: "closure" });
    const codegen = new JsonFx({ backend: "codegen" });
    const failures: string[] = [];
    const stats = { compileErrors: 0, runs: 0, runErrors: 0, values: 0, hostile: 0 };

    for (let i = 0; i < CASES; i++) {
      const seed = FIRST_SEED + i;
      const c = randomCase(seed);
      if (c.hostile) { stats.hostile++; }
      const where = () => `seed ${seed}\n  template: ${safeJson(c.template)}`;

      const a = attempt(() => closure.compile(c.template, { name: "diff" }));
      const b = attempt(() => codegen.compile(c.template, { name: "diff" }));
      if (!a.ok || !b.ok) {
        stats.compileErrors++;
        if (a.ok !== b.ok || describeError((a as { error: unknown }).error) !== describeError((b as { error: unknown }).error)) {
          failures.push(`${where()}\n  compile: closure ${a.ok ? "ok" : describeError(a.error)} vs codegen ${b.ok ? "ok" : describeError(b.error)}`);
        }
        continue;
      }
      const ta = a.value as ReturnType<JsonFx["compile"]>;
      const tb = b.value as ReturnType<JsonFx["compile"]>;

      for (const inputs of c.inputs) {
        stats.runs++;
        const ra = attempt(() => ta.run(inputs));
        const rb = attempt(() => tb.run(inputs));
        if (ra.ok) { stats.values++; } else { stats.runErrors++; }
        let why: string | null = null;
        if (ra.ok !== rb.ok) {
          why = `closure ${ra.ok ? `value ${safeJson(ra.value)}` : describeError(ra.error)} vs codegen ${rb.ok ? `value ${safeJson(rb.value)}` : describeError(rb.error)}`;
        } else if (ra.ok && rb.ok) {
          const d = difference(ra.value, rb.value);
          if (d) { why = `values differ at ${d}\n  closure: ${safeJson(ra.value)}\n  codegen: ${safeJson(rb.value)}`; }
        } else if (describeError((ra as { error: unknown }).error) !== describeError((rb as { error: unknown }).error)) {
          why = `errors differ\n  closure: ${describeError((ra as { error: unknown }).error)}\n  codegen: ${describeError((rb as { error: unknown }).error)}`;
        }
        if (why) { failures.push(`${where()}\n  inputs: ${safeJson(inputs)}\n  ${why}`); break; }
      }
      if (failures.length >= MAX_REPORTED) { break; }
    }

    // eslint-disable-next-line no-console
    console.log(`differential: ${CASES} templates, ${stats.compileErrors} compile errors, ${stats.runs} runs (${stats.values} values, ${stats.runErrors} errors), ${stats.hostile} with hostile literals`);
    expect(failures.join("\n\n")).toBe("");
    // The generator must mostly produce programs that compile and run, or agreement proves little.
    if (CASES >= 500) {
      expect(stats.compileErrors / CASES, "too many templates fail to compile").toBeLessThan(0.25);
      expect(stats.values / stats.runs, "too few runs produce a value").toBeGreaterThan(0.4);
      expect(stats.runErrors / stats.runs, "too few runs produce an error").toBeGreaterThan(0.02);
    }
  }, 600_000);
});
