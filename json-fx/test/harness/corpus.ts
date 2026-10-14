import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { knownFixtureNames, knownFunctionNames } from "./fixtures";
import type { ConformanceCase, ConformanceRun, CorpusFile } from "./types";

export const CONFORMANCE_DIR = join(__dirname, "..", "conformance");

export interface LoadedCase { file: string; case: ConformanceCase; }

function validate(file: string, c: ConformanceCase): string[] {
  const problems: string[] = [];
  const where = `${file}: "${c.name}"`;
  if (!c.name) { problems.push(`${file}: case without a name`); }
  if (!("template" in c)) { problems.push(`${where}: missing template`); }
  if (!["same", "differs", "skip"].includes(c.v0)) { problems.push(`${where}: v0 must be same|differs|skip`); }
  if (c.v0 === "differs" && !(c.bug || c.note)) { problems.push(`${where}: v0 "differs" needs "bug" or "note"`); }
  if (c.v0 === "differs" && !c.change) { problems.push(`${where}: v0 "differs" needs "change" (A|B|C|D)`); }
  if (c.options && c.v0 !== "skip") { problems.push(`${where}: cases with options must be v0 "skip"`); }
  for (const f of c.functions ?? []) {
    if (!knownFunctionNames().includes(f)) { problems.push(`${where}: unknown test function "${f}"`); }
  }
  const runs: ConformanceRun[] = c.runs ?? [c];
  if (c.runs && (c.expect !== undefined || c.expectError || c.inputs)) { problems.push(`${where}: top-level inputs/expect cannot be combined with runs`); }
  runs.forEach((r, i) => {
    const tag = c.runs ? `${where} run ${i}` : where;
    if (!("expect" in r) && !r.expectError) { problems.push(`${tag}: needs "expect" or "expectError"`); }
    if (r.expectError && "expect" in r) { problems.push(`${tag}: has both "expect" and "expectError"`); }
    const recordsV0 = "v0Actual" in r || r.v0ActualError !== undefined || r.v0ActualCalls;
    if (recordsV0 && c.v0 !== "differs") { problems.push(`${tag}: v0Actual* only valid with v0 "differs"`); }
  });
  const fixtureRefs = JSON.stringify(runs.map(r => r.inputs ?? {})).match(/"\$\$fixture":"([^"]+)"/g) ?? [];
  for (const ref of fixtureRefs) {
    const name = ref.slice('"$$fixture":"'.length, -1);
    if (!knownFixtureNames().includes(name)) { problems.push(`${where}: unknown fixture "${name}"`); }
  }
  return problems;
}

/** Loads and validates every `test/conformance/*.json`. Throws one error listing all corpus problems. */
export function loadCorpus(dir: string = CONFORMANCE_DIR): LoadedCase[] {
  const loaded: LoadedCase[] = [];
  const problems: string[] = [];
  const seen = new Map<string, string>();
  for (const file of readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
    const parsed = JSON.parse(readFileSync(join(dir, file), "utf8")) as CorpusFile | ConformanceCase[];
    const { defaults = {}, cases } = Array.isArray(parsed) ? { defaults: {}, cases: parsed } : parsed;
    for (const raw of cases) {
      const c = { ...defaults, ...raw } as ConformanceCase;
      problems.push(...validate(file, c));
      if (seen.has(c.name)) { problems.push(`${file}: duplicate case name "${c.name}" (also in ${seen.get(c.name)})`); }
      seen.set(c.name, file);
      loaded.push({ file, case: c });
    }
  }
  if (problems.length) { throw new Error("Invalid conformance corpus:\n  " + problems.join("\n  ")); }
  return loaded;
}
