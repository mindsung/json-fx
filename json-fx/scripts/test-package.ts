/**
 * `npm run test:package`: packs the library exactly as it would be published, installs the tarball into throw-away
 * projects and checks that it imports, runs and type-checks as a consumer would use it:
 *   - a CommonJS project (`require`), an ES module project (`import`), a TypeScript project under every module resolution
 *     mode (node10, node16 as CJS and as ESM, bundler), and the `json-fx` command.
 * Run `npm run build` first.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(__dirname, "..");
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
const work = mkdtempSync(join(tmpdir(), "json-fx-package-"));
let failures = 0;

// Under `npm publish` (prepublishOnly, possibly with --dry-run) npm passes its own settings down as environment variables;
// `npm_config_dry_run` would turn every `npm install` below into a no-op, so the children get a clean environment.
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^npm_(config_dry_?run|command|lifecycle_|package_)/i.test(k)));
const sh = (cmd: string, args: string[], cwd: string) => execFileSync(cmd, args, { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
function step(name: string, fn: () => void): void {
  try { fn(); console.log(`ok    ${name}`); } catch (e: any) { failures++; console.log(`FAIL  ${name}\n${String(e.stdout ?? "")}${String(e.stderr ?? "")}${e.stderr || e.stdout ? "" : e.message}`); }
}
function expectEqual(actual: string, expected: string): void {
  if (actual.trim() !== expected) { throw new Error(`expected ${expected}, got ${actual.trim()}`); }
}
function project(name: string, files: Record<string, string>): string {
  const dir = join(work, name);
  mkdirSync(dir, { recursive: true });
  for (const [file, content] of Object.entries(files)) { writeFileSync(join(dir, file), content); }
  sh("npm", ["install", "--silent", "--no-audit", "--no-fund", tarball], dir);
  return dir;
}

const packed = JSON.parse(sh("npm", ["pack", "--json", "--pack-destination", work], root)) as { filename: string; files: { path: string }[] }[];
const tarball = join(work, packed[0]!.filename);
console.log(`packed ${packed[0]!.filename}: ${packed[0]!.files.length} files`);

const program = (lang: "cjs" | "esm") => {
  const load = lang === "cjs" ? `const { JsonFx, FxRuntimeError } = require("@mindsung/json-fx");` : `import { JsonFx, FxRuntimeError } from "@mindsung/json-fx";`;
  return `${load}
const fx = new JsonFx([{ name: "double", evaluate: (n) => n * 2 }]);
const out = fx.compile({ "$k": "$.n:double", twice: "$k", label: "'big' if $k > 10 else 'small'" }).run({ $: { n: 7 } });
let kind = "none";
try { fx.compile("$.a.b").run({ $: {} }); } catch (e) { kind = e instanceof FxRuntimeError ? "FxRuntimeError" : e.constructor.name; }
console.log(JSON.stringify({ out, kind }));
`;
};
const expected = `{"out":{"twice":14,"label":"big"},"kind":"FxRuntimeError"}`;

step("CommonJS project: require()", () => {
  const dir = project("cjs", { "package.json": `{"name":"cjs-consumer","version":"1.0.0"}`, "index.js": program("cjs") });
  expectEqual(sh("node", ["index.js"], dir), expected);
});

step("ES module project: import", () => {
  const dir = project("esm", { "package.json": `{"name":"esm-consumer","version":"1.0.0","type":"module"}`, "index.js": program("esm") });
  expectEqual(sh("node", ["index.js"], dir), expected);
});

step("CommonJS project: dynamic import() and .mjs", () => {
  const dir = project("cjs-mjs", { "package.json": `{"name":"cjs-mjs","version":"1.0.0"}`, "index.mjs": program("esm") });
  expectEqual(sh("node", ["index.mjs"], dir), expected);
});

const ts = `import { JsonFx, FxRuntimeError, type FxFunctionDef, type FxCompiledTemplate } from "@mindsung/json-fx";
const defs: FxFunctionDef[] = [{ name: "double", pure: true, evaluate: (n: number) => n * 2 }];
const compiled: FxCompiledTemplate = new JsonFx(defs).compile("$.n:double");
const result: number = compiled.run({ $: { n: 2 } });
export const e: unknown = new FxRuntimeError("x");
export default result;
`;
const modes: [string, Record<string, unknown>, "cjs" | "esm"][] = [
  ["node10 (classic CommonJS resolution)", { module: "commonjs", moduleResolution: "node10" }, "cjs"],
  ["node16 from a CommonJS package", { module: "node16", moduleResolution: "node16" }, "cjs"],
  ["node16 from an ES module package", { module: "node16", moduleResolution: "node16" }, "esm"],
  ["bundler", { module: "esnext", moduleResolution: "bundler" }, "esm"]
];
modes.forEach(([label, options, kind], i) => step(`TypeScript, ${label}`, () => {
  const dir = project(`ts-${i}`, {
    "package.json": `{"name":"ts-consumer-${i}","version":"1.0.0"${kind === "esm" ? `,"type":"module"` : ""}}`,
    "index.ts": ts,
    "tsconfig.json": JSON.stringify({ compilerOptions: { ...options, target: "es2020", strict: true, noEmit: true, types: [], skipLibCheck: false } })
  });
  sh("node", [tsc, "-p", "."], dir);
}));

step("json-fx command", () => {
  const dir = project("bin", { "package.json": `{"name":"bin-consumer","version":"1.0.0"}`, "ok.template.json": `{"a": "$.x + 1"}`, "bad.template.json": `"nope($.x)"` });
  const bin = join(dir, "node_modules", ".bin", "json-fx");
  const help = sh(bin, ["--help"], dir);
  if (!help.includes("Usage: json-fx check")) { throw new Error("no usage text"); }
  const clean = sh(bin, ["check", "ok.template.json"], dir);
  if (!/1 clean/.test(clean)) { throw new Error(`unexpected report:\n${clean}`); }
  let status = 0;
  try { sh(bin, ["check", "bad.template.json"], dir); } catch (e: any) { status = e.status; }
  if (status !== 1) { throw new Error(`expected exit status 1 for a template with errors, got ${status}`); }
});

step("package contents", () => {
  const paths = packed[0]!.files.map(f => f.path);
  for (const required of ["package.json", "README.md", "LICENSE", "CHANGELOG.md", "dist/index.js", "dist/index.mjs", "dist/index.d.ts", "dist/index.d.mts", "dist/cli.js", "docs/MIGRATION.md", "docs/FUNCTIONS.md"]) {
    if (!paths.includes(required)) { throw new Error(`missing ${required}`); }
  }
  const unexpected = paths.filter(p => !/^(dist|docs)\//.test(p) && !["package.json", "README.md", "LICENSE", "CHANGELOG.md"].includes(p));
  if (unexpected.length) { throw new Error(`unexpected files: ${unexpected.join(", ")}`); }
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  if (pkg.dependencies && Object.keys(pkg.dependencies).length) { throw new Error("the library must have no runtime dependencies"); }
});

rmSync(work, { recursive: true, force: true });
console.log(failures ? `\n${failures} check(s) failed` : "\nall package checks passed");
process.exit(failures ? 1 : 0);
