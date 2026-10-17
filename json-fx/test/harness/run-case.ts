import { isDeepStrictEqual } from "node:util";
import type { Engine } from "./engines";
import { decode, makeTestFunctions } from "./fixtures";
import type { ConformanceCase, ConformanceRun, ExpectedError } from "./types";

export type Outcome =
  | { ok: true; value: unknown }
  | { ok: false; phase: "compile" | "run"; errorType: string; message: string };

export interface RunResult {
  outcome: Outcome;
  calls: Record<string, number>;
}

/** Normalizes a case into its list of runs (the case itself is the single run when `runs` is absent). */
export function runsOf(c: ConformanceCase): ConformanceRun[] {
  return c.runs ?? [c];
}

function failure(phase: "compile" | "run", e: unknown): Outcome {
  const err = e as { name?: string; constructor?: { name?: string }; message?: string };
  return { ok: false, phase, errorType: err?.constructor?.name ?? err?.name ?? "Error", message: String(err?.message ?? e) };
}

/** Compiles the case's template once and evaluates every run against it. Never throws for template errors. */
export function executeCase(engine: Engine, c: ConformanceCase): RunResult[] {
  const fns = makeTestFunctions(c.functions);
  const runs = runsOf(c);
  let template: ReturnType<Engine["compile"]>;
  try {
    template = engine.compile(c.template, fns.defs, c.options);
  } catch (e) {
    const outcome = failure("compile", e);
    return runs.map(() => ({ outcome, calls: {} }));
  }
  return runs.map(run => {
    fns.resetCalls();
    let outcome: Outcome;
    try {
      outcome = { ok: true, value: template.run(decode(run.inputs ?? {}) as Record<string, unknown>) };
    } catch (e) {
      outcome = failure("run", e);
    }
    return { outcome, calls: { ...fns.calls } };
  });
}

function matchesMessage(message: string, match?: string): boolean {
  return match == null || message.toLowerCase().includes(match.toLowerCase());
}

function callsMismatch(expected: Record<string, number> | undefined, actual: Record<string, number>): string | null {
  if (!expected) { return null; }
  for (const [name, count] of Object.entries(expected)) {
    if ((actual[name] ?? 0) !== count) { return `calls of "${name}": expected ${count}, got ${actual[name] ?? 0}`; }
  }
  return null;
}

function describeOutcome(o: Outcome): string {
  return o.ok ? `value ${safeStringify(o.value)}` : `${o.phase} error ${o.errorType}: ${o.message}`;
}

export function safeStringify(v: unknown): string {
  if (v === undefined) { return "undefined"; }
  try { return JSON.stringify(v) ?? String(v); } catch { return String(v); }
}

/** Returns null when the run satisfies the case's expectation, otherwise a human-readable reason. */
export function checkRun(engine: Engine, run: ConformanceRun, result: RunResult): string | null {
  const { outcome } = result;
  if (run.expectError) {
    if (outcome.ok) { return `expected an error, got ${describeOutcome(outcome)}`; }
    const exp: ExpectedError = run.expectError;
    if (!matchesMessage(outcome.message, exp.match)) { return `error message ${JSON.stringify(outcome.message)} does not match ${JSON.stringify(exp.match)}`; }
    if (engine.strictErrors) {
      if (exp.type && outcome.errorType !== exp.type) { return `expected error type ${exp.type}, got ${outcome.errorType}`; }
      if (exp.phase && outcome.phase !== exp.phase) { return `expected ${exp.phase}-time error, got ${outcome.phase}-time`; }
    }
  } else {
    if (!outcome.ok) { return `expected a value, got ${describeOutcome(outcome)}`; }
    const expected = decode(run.expect);
    if (!isDeepStrictEqual(outcome.value, expected)) {
      return `expected ${safeStringify(expected)}, got ${safeStringify(outcome.value)}`;
    }
  }
  return callsMismatch(run.expectCalls, result.calls);
}

/** For `v0: "differs"` runs that record what v0 actually does: returns a reason when v0's behavior no longer matches the record. */
export function checkRecordedV0(run: ConformanceRun, result: RunResult): string | null {
  const { outcome } = result;
  if (run.v0ActualError !== undefined) {
    if (outcome.ok) { return `v0 was recorded to throw ${JSON.stringify(run.v0ActualError)}, but returned ${describeOutcome(outcome)}`; }
    if (!matchesMessage(outcome.message, run.v0ActualError)) { return `v0 error ${JSON.stringify(outcome.message)} does not match recorded ${JSON.stringify(run.v0ActualError)}`; }
  } else if ("v0Actual" in run) {
    if (!outcome.ok) { return `v0 was recorded to return ${safeStringify(decode(run.v0Actual))}, but threw ${describeOutcome(outcome)}`; }
    const recorded = decode(run.v0Actual);
    if (!isDeepStrictEqual(outcome.value, recorded)) { return `v0 was recorded to return ${safeStringify(recorded)}, but returned ${safeStringify(outcome.value)}`; }
  }
  if (run.v0ActualCalls) {
    const mismatch = callsMismatch(run.v0ActualCalls, result.calls);
    if (mismatch) { return `v0 ${mismatch}`; }
  }
  return null;
}
