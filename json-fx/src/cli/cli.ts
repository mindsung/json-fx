import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { JsonFx } from "../api/json-fx";
import type { CheckReport, Finding } from "../check/check";
import type { FxFunctionDef } from "../api/types";

export interface CliIo {
  out(text: string): void;
  err(text: string): void;
}

const USAGE = `Usage: json-fx check [options] <file-or-directory>...

Compiles each template and reports compile errors (with suggestions), every construct whose meaning differs from v0
(see docs/MIGRATION.md), warnings, and bare words that became string constants.

A directory is searched (recursively) for *.template.json files; if it has none, for *.json files other than *.inputs.json.
A file holds one template: any JSON value, where a string is a single expression.

Options:
  --functions <module>   CommonJS module exporting an array of extension function definitions
  --inputs <names>       comma-separated declared inputs, e.g. '$,$order'; other $names are errors
  --globals <names>      comma-separated global names to treat as defined, e.g. '$config'
  --strict-identifiers   bare words are errors instead of string constants
  --strict               exit 1 when there are change findings, not only errors
  --quiet                hide informational findings (bare words)
  --json                 print the report as JSON
  -h, --help             this text

Exit status: 0 no errors, 1 errors (or change findings with --strict), 64 usage error.
`;

interface Options {
  paths: string[];
  functions: string | undefined;
  inputs: string[] | undefined;
  globals: string[];
  strictIdentifiers: boolean;
  strict: boolean;
  quiet: boolean;
  json: boolean;
}

class UsageError extends Error {}

function parseArgs(args: readonly string[]): Options | "help" {
  const o: Options = { paths: [], functions: undefined, inputs: undefined, globals: [], strictIdentifiers: false, strict: false, quiet: false, json: false };
  const value = (i: number, flag: string): string => {
    const v = args[i + 1];
    if (v === undefined || v.startsWith("--")) { throw new UsageError(`${flag} needs a value`); }
    return v;
  };
  const list = (s: string): string[] => s.split(",").map(x => x.trim()).filter(Boolean);
  for (let i = 0; i < args.length; i++) {
    const a = args[i] as string;
    switch (a) {
      case "-h": case "--help": return "help";
      case "--functions": o.functions = value(i, a); i++; break;
      case "--inputs": o.inputs = list(value(i, a)); i++; break;
      case "--globals": o.globals = list(value(i, a)); i++; break;
      case "--strict-identifiers": o.strictIdentifiers = true; break;
      case "--strict": o.strict = true; break;
      case "--quiet": o.quiet = true; break;
      case "--json": o.json = true; break;
      default:
        if (a.startsWith("-")) { throw new UsageError(`Unknown option ${a}`); }
        o.paths.push(a);
    }
  }
  if (!o.paths.length) { throw new UsageError("No file or directory given"); }
  return o;
}

function templateFiles(path: string): string[] {
  if (!statSync(path).isFile()) {
    const all: string[] = [];
    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
        if (entry.name === "node_modules" || entry.name.startsWith(".")) { continue; }
        const full = join(dir, entry.name);
        if (entry.isDirectory()) { walk(full); } else if (entry.name.endsWith(".json")) { all.push(full); }
      }
    };
    walk(path);
    const named = all.filter(f => f.endsWith(".template.json"));
    return named.length ? named : all.filter(f => !f.endsWith(".inputs.json"));
  }
  return [path];
}

interface FileReport { readonly file: string; readonly report: CheckReport; }

function checkFile(fx: JsonFx, file: string, options: Options): FileReport {
  let template: unknown;
  try {
    template = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    const finding: Finding = { rule: "error", level: "error", message: `Not valid JSON: ${(e as Error).message}`, path: "", line: 0, column: 0 };
    return { file, report: { ok: false, findings: [finding] } };
  }
  return {
    file,
    report: fx.check(template, {
      ...(options.inputs ? { inputs: options.inputs } : {}),
      ...(options.strictIdentifiers ? { strictIdentifiers: true } : {})
    })
  };
}

const where = (f: Finding): string => {
  const position = f.line > 0 ? `${f.line}:${f.column}` : "";
  return [f.path || "(root)", position].filter(Boolean).join(" ");
};

function formatText(reports: readonly FileReport[], options: Options): string {
  const lines: string[] = [];
  const totals = { error: 0, change: 0, warning: 0, info: 0, clean: 0 };
  for (const { file, report } of reports) {
    const shown = report.findings.filter(f => !(options.quiet && f.level === "info"));
    for (const f of report.findings) { totals[f.level]++; }
    if (!report.findings.length) { totals.clean++; }
    if (!shown.length) { continue; }
    lines.push(file);
    for (const f of shown) { lines.push(`  ${f.level.padEnd(7)} ${f.rule.padEnd(9)} ${where(f)}  ${f.message}`); }
    lines.push("");
  }
  lines.push(`${reports.length} template(s): ${totals.clean} clean, ${totals.error} error(s), ${totals.change} change finding(s), ${totals.warning} warning(s), ${totals.info} note(s)`);
  return lines.join("\n") + "\n";
}

/** Runs the CLI; returns the process exit status. */
export function runCli(argv: readonly string[], io: CliIo): number {
  const [command, ...rest] = argv;
  if (command === undefined || command === "-h" || command === "--help" || command === "help") { io.out(USAGE); return command === undefined ? 64 : 0; }
  if (command !== "check") { io.err(`Unknown command '${command}'\n\n${USAGE}`); return 64; }

  let options: Options | "help";
  try { options = parseArgs(rest); } catch (e) {
    if (!(e instanceof UsageError)) { throw e; }
    io.err(`${e.message}\n\n${USAGE}`);
    return 64;
  }
  if (options === "help") { io.out(USAGE); return 0; }

  let functions: FxFunctionDef[][] = [];
  if (options.functions) {
    try {
      const loaded = createRequire(join(process.cwd(), "noop.js"))(resolve(options.functions)) as unknown;
      const defs = Array.isArray(loaded) ? loaded : (loaded as { default?: unknown })?.default;
      if (!Array.isArray(defs)) { throw new Error("the module must export an array of function definitions"); }
      functions = [defs as FxFunctionDef[]];
    } catch (e) {
      io.err(`Cannot load --functions ${options.functions}: ${(e as Error).message}\n`);
      return 64;
    }
  }
  const fx = new JsonFx({ functions });
  for (const g of options.globals) { fx.defineGlobal(g as `$${string}`, undefined); }

  const files: string[] = [];
  for (const p of options.paths) {
    if (!existsSync(p)) { io.err(`No such file or directory: ${p}\n`); return 64; }
    files.push(...templateFiles(p));
  }
  if (!files.length) { io.err("No template files found\n"); return 64; }

  const reports = files.map(f => checkFile(fx, f, options as Options));
  if (options.json) {
    io.out(JSON.stringify(reports.map(r => ({ file: r.file, ok: r.report.ok, findings: r.report.findings })), null, 2) + "\n");
  } else {
    io.out(formatText(reports, options));
  }
  const failed = reports.some(r => !r.report.ok || (options.strict && r.report.findings.some(f => f.level === "change")));
  return failed ? 1 : 0;
}
