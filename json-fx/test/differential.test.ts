import { describe, expect, it } from "vitest";
import { JsonFx } from "../src-v1";
import { randomCase } from "./harness/random-template";

/**
 * Differential test (V1-PLAN.md Phases 4 and 5): random templates × random inputs must give the same value or the same
 * error on the unoptimized closure backend (the semantic reference) and on every other combination of backend
 * (closure, code generator) and optimizer (on, off).
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

const REFERENCE = "closure/unoptimized";
const VARIANTS: ReadonlyArray<{ name: string; backend: "closure" | "codegen"; optimize: boolean }> = [
  { name: "closure/optimized", backend: "closure", optimize: true },
  { name: "codegen/unoptimized", backend: "codegen", optimize: false },
  { name: "codegen/optimized", backend: "codegen", optimize: true }
];

describe("differential: backends and optimizer", () => {
  it(`agree on ${CASES} random templates (seeds ${FIRST_SEED}…${FIRST_SEED + CASES - 1})`, () => {
    const reference = new JsonFx({ backend: "closure", optimize: false });
    const variants = VARIANTS.map(v => ({ ...v, fx: new JsonFx({ backend: v.backend, optimize: v.optimize }) }));
    const failures: string[] = [];
    const stats = { compileErrors: 0, runs: 0, runErrors: 0, values: 0, hostile: 0, optimized: 0 };

    for (let i = 0; i < CASES && failures.length < MAX_REPORTED; i++) {
      const seed = FIRST_SEED + i;
      const c = randomCase(seed);
      if (c.hostile) { stats.hostile++; }
      const where = () => `seed ${seed}\n  template: ${safeJson(c.template)}`;

      const a = attempt(() => reference.compile(c.template, { name: "diff" }));
      if (!a.ok) { stats.compileErrors++; }

      for (const v of variants) {
        const b = attempt(() => v.fx.compile(c.template, { name: "diff" }));
        if (!a.ok || !b.ok) {
          if (a.ok !== b.ok || describeError((a as { error: unknown }).error) !== describeError((b as { error: unknown }).error)) {
            failures.push(`${where()}\n  compile: ${REFERENCE} ${a.ok ? "ok" : describeError(a.error)} vs ${v.name} ${b.ok ? "ok" : describeError(b.error)}`);
          }
          continue;
        }
        const ta = a.value as ReturnType<JsonFx["compile"]>;
        const tb = b.value as ReturnType<JsonFx["compile"]>;
        if (v.name === "codegen/optimized" && v.fx.compile(c.template, { optimize: false }).source !== tb.source) { stats.optimized++; }

        for (const inputs of c.inputs) {
          const ra = attempt(() => ta.run(inputs));
          const rb = attempt(() => tb.run(inputs));
          if (v === variants[0]) {
            stats.runs++;
            if (ra.ok) { stats.values++; } else { stats.runErrors++; }
          }
          let why: string | null = null;
          if (ra.ok !== rb.ok) {
            why = `${REFERENCE} ${ra.ok ? `value ${safeJson(ra.value)}` : describeError(ra.error)} vs ${v.name} ${rb.ok ? `value ${safeJson(rb.value)}` : describeError(rb.error)}`;
          } else if (ra.ok && rb.ok) {
            const d = difference(ra.value, rb.value);
            if (d) { why = `values differ at ${d}\n  ${REFERENCE}: ${safeJson(ra.value)}\n  ${v.name}: ${safeJson(rb.value)}`; }
          } else if (describeError((ra as { error: unknown }).error) !== describeError((rb as { error: unknown }).error)) {
            why = `errors differ\n  ${REFERENCE}: ${describeError((ra as { error: unknown }).error)}\n  ${v.name}: ${describeError((rb as { error: unknown }).error)}`;
          }
          if (why) { failures.push(`${where()}\n  inputs: ${safeJson(inputs)}\n  ${why}`); break; }
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(`differential: ${CASES} templates, ${stats.compileErrors} compile errors, ${stats.runs} runs (${stats.values} values, ${stats.runErrors} errors), ${stats.hostile} with hostile literals, ${stats.optimized} changed by the optimizer`);
    expect(failures.join("\n\n")).toBe("");
    // The generator must mostly produce programs that compile and run, or agreement proves little.
    if (CASES >= 500) {
      expect(stats.compileErrors / CASES, "too many templates fail to compile").toBeLessThan(0.25);
      expect(stats.values / stats.runs, "too few runs produce a value").toBeGreaterThan(0.4);
      expect(stats.runErrors / stats.runs, "too few runs produce an error").toBeGreaterThan(0.02);
      expect(stats.optimized / CASES, "the optimizer rarely changes the generated templates").toBeGreaterThan(0.1);
    }
  }, 600_000);
});
