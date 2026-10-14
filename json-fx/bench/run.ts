/**
 * Benchmark runner. Usage:
 *   npm run bench                     all fixtures, all engines
 *   npm run bench -- order            one fixture
 *   npm run bench -- --markdown       print a BASELINE.md-style table
 *
 * For every fixture/engine the output is first checked against the hand-written reference on every input
 * (a fast wrong answer is not a result), then timed: warm-up, then three rounds cycling over the inputs.
 */
import { isDeepStrictEqual } from "node:util";
import { arch, cpus, platform } from "node:os";
import { benchEngines, type BenchFn } from "./engines";
import { fixtures } from "./fixtures";

const INPUT_COUNT = 1000;
const WARMUP_MS = 300;
const ROUND_MS = 400;
const ROUNDS = 3;

const args = process.argv.slice(2);
const markdown = args.includes("--markdown");
const only = args.filter(a => !a.startsWith("--"));

function now(): number { return Number(process.hrtime.bigint()) / 1e6; }

/**
 * Builds a timing loop with its own copy of the code, so each candidate gets a monomorphic call site: a shared loop
 * would be polymorphic across engines and penalise whichever function runs second.
 */
function makeTimer(): (f: BenchFn, inputs: unknown[], ms: number) => number {
  return new Function("f", "inputs", "ms", `
    let calls = 0;
    const start = performance.now();
    let elapsed = 0;
    while (elapsed < ms) {
      for (let i = 0; i < inputs.length; i++) { f(inputs[i]); }
      calls += inputs.length;
      elapsed = performance.now() - start;
    }
    return (elapsed * 1000) / calls;
  `) as (f: BenchFn, inputs: unknown[], ms: number) => number;
}

function median(xs: number[]): number { return [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]!; }

interface Row { fixture: string; engine: string; us: number | null; best: number | null; compileUs: number | null; note: string; }
const rows: Row[] = [];
const origLog = console.log;

for (const fixture of fixtures) {
  if (only.length && !only.includes(fixture.name)) { continue; }
  const inputs = Array.from({ length: INPUT_COUNT }, (_, k) => fixture.makeInput(k));
  const reference = inputs.map(i => fixture.handWritten(i));

  const candidates: { name: string; fn: BenchFn | null; compileUs: number | null }[] = benchEngines.map(e => {
    const t = now();
    let fn: BenchFn | null = null;
    try { fn = e.compile(fixture.template); } catch (err) { rows.push({ fixture: fixture.name, engine: e.name, us: null, best: null, compileUs: null, note: `compile failed: ${(err as Error).message}` }); return { name: e.name, fn: null, compileUs: null }; }
    return { name: e.name, fn, compileUs: (now() - t) * 1000 };
  });
  candidates.push({ name: "hand-written", fn: fixture.handWritten as BenchFn, compileUs: 0 });

  for (const { name, fn, compileUs } of candidates) {
    if (!fn) { continue; }
    let note = "";
    console.log = () => undefined; // silence `log` output from templates while checking
    const mismatch = inputs.findIndex((input, i) => !isDeepStrictEqual(fn(input), reference[i]));
    console.log = origLog;
    if (mismatch >= 0) {
      const known = fixture.knownMismatch?.[name];
      if (!known) { throw new Error(`${fixture.name}: ${name} disagrees with the hand-written reference on input ${mismatch} — refusing to time a wrong answer`); }
      note = `output differs from reference (${known})`;
    }
    const timeIt = makeTimer();
    timeIt(fn, inputs, WARMUP_MS);
    const samples = Array.from({ length: ROUNDS }, () => timeIt(fn, inputs, ROUND_MS));
    rows.push({ fixture: fixture.name, engine: name, us: median(samples), best: Math.min(...samples), compileUs, note });
  }
}

const fmt = (n: number | null, d = 2) => (n == null ? "n/a" : n.toFixed(d));

if (markdown) {
  const cpu = cpus()[0]?.model ?? "unknown cpu";
  console.log(`Node ${process.version}, ${platform()} ${arch()}, ${cpu}\n`);
  console.log("| Fixture | Engine | µs / evaluation (median of 3) | best | compile µs | note |");
  console.log("|---|---|---|---|---|---|");
  for (const r of rows) { console.log(`| ${r.fixture} | ${r.engine} | ${fmt(r.us)} | ${fmt(r.best)} | ${fmt(r.compileUs, 0)} | ${r.note} |`); }
} else {
  for (const fixtureName of [...new Set(rows.map(r => r.fixture))]) {
    console.log(`\n${fixtureName}`);
    for (const r of rows.filter(x => x.fixture === fixtureName)) {
      console.log(`  ${r.engine.padEnd(14)} ${fmt(r.us).padStart(9)} µs/eval   compile ${fmt(r.compileUs, 0).padStart(7)} µs${r.note ? "   " + r.note : ""}`);
    }
  }
}
