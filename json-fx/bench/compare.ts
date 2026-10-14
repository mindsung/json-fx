/**
 * Side-by-side v0/v1 comparison over real templates (V1-PLAN.md §7.3 release gate).
 *
 *   npm run compare -- [dir] [--functions ./extensions.js]
 *
 * `dir` (default: real-templates/) holds, per template NAME:
 *   NAME.template.json   the template (any JSON; a string is a single expression)
 *   NAME.inputs.json     optional: one inputs object, e.g. { "$": {...}, "$other": 1 }, or an array of such objects
 * `--functions` is a CommonJS module exporting an array of extension function definitions, registered with both engines.
 *
 * Every difference in value or in error/no-error is reported and exits 1. Both engines throwing counts as agreement
 * (the messages are shown for information). Exits 2 if v1 isn't available yet (v0 results are still listed).
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { join, resolve } from "node:path";
import { EngineUnavailableError, v0Engine, v1Engine, type Engine } from "../test/harness/engines";
import { safeStringify } from "../test/harness/run-case";

const args = process.argv.slice(2);
const fnIndex = args.indexOf("--functions");
const functionsPath = fnIndex >= 0 ? args[fnIndex + 1] : undefined;
const positional = args.filter((a, i) => !a.startsWith("--") && !(fnIndex >= 0 && i === fnIndex + 1));
const dir = resolve(positional[0] ?? "real-templates");

const functions: any[] = functionsPath ? require(resolve(functionsPath)) : [];

type Result = { ok: true; value: unknown } | { ok: false; message: string } | { unavailable: true };

function evaluate(engine: Engine, template: unknown, inputs: Record<string, unknown>): Result {
  try {
    const compiled = engine.compile(template, functions);
    return { ok: true, value: compiled.run(inputs) };
  } catch (e) {
    if (e instanceof EngineUnavailableError) { return { unavailable: true }; }
    return { ok: false, message: String((e as Error)?.message ?? e) };
  }
}

function describe(r: Result): string {
  if ("unavailable" in r) { return "n/a"; }
  return r.ok ? safeStringify(r.value) : `throws: ${r.message}`;
}

function agree(a: Result, b: Result): boolean {
  if ("unavailable" in a || "unavailable" in b) { return true; }
  if (a.ok !== b.ok) { return false; }
  return a.ok && b.ok ? isDeepStrictEqual(a.value, b.value) : true;
}

if (!existsSync(dir)) { console.error(`No such directory: ${dir}`); process.exit(64); }
const names = readdirSync(dir).filter(f => f.endsWith(".template.json")).map(f => f.slice(0, -".template.json".length)).sort();
if (!names.length) { console.error(`No *.template.json files in ${dir} (see real-templates/README.md)`); process.exit(64); }

const origLog = console.log;
let total = 0, diffs = 0, v1Missing = false;
for (const name of names) {
  const template = JSON.parse(readFileSync(join(dir, `${name}.template.json`), "utf8"));
  const inputsFile = join(dir, `${name}.inputs.json`);
  const parsed = existsSync(inputsFile) ? JSON.parse(readFileSync(inputsFile, "utf8")) : {};
  const samples: Record<string, unknown>[] = Array.isArray(parsed) ? parsed : [parsed];
  samples.forEach((inputs, i) => {
    console.log = () => undefined; // templates may call log()
    const r0 = evaluate(v0Engine, template, inputs);
    const r1 = evaluate(v1Engine, template, inputs);
    console.log = origLog;
    total++;
    if ("unavailable" in r1) { v1Missing = true; }
    const label = `${name}${samples.length > 1 ? `[${i}]` : ""}`;
    if (agree(r0, r1)) {
      console.log(`${"unavailable" in r1 ? "v0   " : "SAME "} ${label}${"unavailable" in r1 ? `  → ${describe(r0)}` : ""}`);
    } else {
      diffs++;
      console.log(`DIFF  ${label}\n        v0: ${describe(r0)}\n        v1: ${describe(r1)}`);
    }
  });
}

console.log(`\n${total} comparison(s), ${diffs} difference(s)${v1Missing ? " — v1 engine not available yet" : ""}`);
process.exit(v1Missing ? 2 : diffs ? 1 : 0);
