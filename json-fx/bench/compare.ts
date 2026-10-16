/**
 * Side-by-side v0/v1 comparison over real templates (V1-PLAN.md §7.3 release gate).
 *
 *   npm run compare -- [dir] [--functions ./extensions.js]
 *
 * `dir` (default: real-templates/) holds templates in either layout:
 *   NAME.template.json          the template (any JSON; a string is a single expression), with optionally
 *   NAME.inputs.json            one inputs object, e.g. { "$": {...}, "$other": 1 }, or an array of such objects
 * or one directory per template:
 *   NAME/NAME.template.json
 *   NAME/inputs/*.json          sample documents, each evaluated as the `$` input
 *   NAME/NAME.inputs.json       optional, as above
 * A template with no samples is evaluated once with no inputs.
 * `--functions` is a CommonJS module exporting an array of extension function definitions, registered with both engines.
 *
 * Every difference in value or in error/no-error is reported (with the first differing path) and exits 1. Both engines
 * throwing counts as agreement (the messages are shown for information). Exits 2 if v1 isn't available yet (v0 results
 * are still listed).
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { join, resolve } from "node:path";
import { EngineUnavailableError, v0Engine, v1Engine, type Engine, type EngineTemplate } from "../test/harness/engines";
import { safeStringify } from "../test/harness/run-case";

const args = process.argv.slice(2);
const fnIndex = args.indexOf("--functions");
const functionsPath = fnIndex >= 0 ? args[fnIndex + 1] : undefined;
const positional = args.filter((a, i) => !a.startsWith("--") && !(fnIndex >= 0 && i === fnIndex + 1));
const dir = resolve(positional[0] ?? "real-templates");

const functions: any[] = functionsPath ? require(resolve(functionsPath)) : [];

type Result = { ok: true; value: unknown } | { ok: false; message: string } | { unavailable: true };
type Compiled = { ok: true; template: EngineTemplate } | Exclude<Result, { ok: true }>;
interface Sample { label: string; inputs: Record<string, unknown> }
interface Entry { name: string; templateFile: string; samples: Sample[] }

function compile(engine: Engine, template: unknown): Compiled {
  try {
    return { ok: true, template: engine.compile(template, functions) };
  } catch (e) {
    if (e instanceof EngineUnavailableError) { return { unavailable: true }; }
    return { ok: false, message: String((e as Error)?.message ?? e) };
  }
}

function run(compiled: Compiled, inputs: Record<string, unknown>): Result {
  if (!("template" in compiled)) { return compiled; }
  try {
    return { ok: true, value: compiled.template.run(inputs) };
  } catch (e) {
    return { ok: false, message: String((e as Error)?.message ?? e) };
  }
}

const MAX_SHOWN = 400;
const clip = (s: string) => s.length > MAX_SHOWN ? `${s.slice(0, MAX_SHOWN)}… (${s.length} chars)` : s;

function describe(r: Result): string {
  if ("unavailable" in r) { return "n/a"; }
  return clip(r.ok ? safeStringify(r.value) : `throws: ${r.message}`);
}

function agree(a: Result, b: Result): boolean {
  if ("unavailable" in a || "unavailable" in b) { return true; }
  if (a.ok !== b.ok) { return false; }
  return a.ok && b.ok ? isDeepStrictEqual(a.value, b.value) : true;
}

/** Path of the first place where `a` and `b` differ (`isDeepStrictEqual` semantics), or undefined. */
function firstDifference(a: unknown, b: unknown, path = "$"): { path: string; a: unknown; b: unknown } | undefined {
  if (isDeepStrictEqual(a, b)) { return undefined; }
  const isObj = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object";
  if (isObj(a) && isObj(b) && Array.isArray(a) === Array.isArray(b) && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
    for (const k of keys) {
      if (!(k in a) || !(k in b)) { return { path: `${path}.${k}`, a: k in a ? a[k] : "(missing)", b: k in b ? b[k] : "(missing)" }; }
      const d = firstDifference(a[k], b[k], Array.isArray(a) ? `${path}[${k}]` : `${path}.${k}`);
      if (d) { return d; }
    }
  }
  return { path, a, b };
}

const readJson = (file: string) => JSON.parse(readFileSync(file, "utf8"));

/** `NAME.inputs.json`: one inputs object or an array of them. */
function inputsFileSamples(file: string): Sample[] {
  if (!existsSync(file)) { return []; }
  const parsed = readJson(file);
  const all: Record<string, unknown>[] = Array.isArray(parsed) ? parsed : [parsed];
  return all.map((inputs, i) => ({ label: all.length > 1 ? `[${i}]` : "", inputs }));
}

function discover(root: string): Entry[] {
  const entries: Entry[] = [];
  for (const f of readdirSync(root).sort()) {
    const full = join(root, f);
    if (f.endsWith(".template.json")) {
      const name = f.slice(0, -".template.json".length);
      entries.push({ name, templateFile: full, samples: inputsFileSamples(join(root, `${name}.inputs.json`)) });
    } else if (statSync(full).isDirectory() && existsSync(join(full, `${f}.template.json`))) {
      const samples = inputsFileSamples(join(full, `${f}.inputs.json`));
      const inputsDir = join(full, "inputs");
      if (existsSync(inputsDir)) {
        for (const doc of readdirSync(inputsDir).filter(d => d.endsWith(".json")).sort()) {
          samples.push({ label: ` ${doc}`, inputs: { $: readJson(join(inputsDir, doc)) } });
        }
      }
      entries.push({ name: f, templateFile: join(full, `${f}.template.json`), samples });
    }
  }
  return entries;
}

if (!existsSync(dir)) { console.error(`No such directory: ${dir}`); process.exit(64); }
const entries = discover(dir);
if (!entries.length) { console.error(`No templates in ${dir} (see real-templates/README.md)`); process.exit(64); }

const origLog = console.log;
let total = 0, diffs = 0, v1Missing = false;
for (const { name, templateFile, samples } of entries) {
  const template = readJson(templateFile);
  console.log = () => undefined; // templates may call log()
  const c0 = compile(v0Engine, template);
  const c1 = compile(v1Engine, template);
  console.log = origLog;
  for (const { label: suffix, inputs } of samples.length ? samples : [{ label: "", inputs: {} }]) {
    console.log = () => undefined;
    const r0 = run(c0, inputs);
    const r1 = run(c1, inputs);
    console.log = origLog;
    total++;
    if ("unavailable" in r1) { v1Missing = true; }
    const label = `${name}${suffix}`;
    if (agree(r0, r1)) {
      const note = "unavailable" in r1 ? `  → ${describe(r0)}` : "ok" in r0 && !r0.ok ? `  (both throw: ${clip(r0.message)})` : "";
      console.log(`${"unavailable" in r1 ? "v0   " : "SAME "} ${label}${note}`);
    } else {
      diffs++;
      const d = "ok" in r0 && "ok" in r1 && r0.ok && r1.ok ? firstDifference(r0.value, r1.value) : undefined;
      console.log(`DIFF  ${label}${d ? `\n        first difference at ${d.path}\n          v0: ${clip(safeStringify(d.a))}\n          v1: ${clip(safeStringify(d.b))}` : ""}`
        + `\n        v0: ${describe(r0)}\n        v1: ${describe(r1)}`);
    }
  }
}

console.log(`\n${total} comparison(s), ${diffs} difference(s)${v1Missing ? " — v1 engine not available yet" : ""}`);
process.exit(v1Missing ? 2 : diffs ? 1 : 0);
