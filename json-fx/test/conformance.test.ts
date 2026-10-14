import { describe, expect, it } from "vitest";
import { v0Engine, type Engine } from "./harness/engines";
import { loadCorpus } from "./harness/corpus";
import { checkRecordedV0, checkRun, executeCase, runsOf } from "./harness/run-case";

const corpus = loadCorpus();

/** Engines under test. v1 engines are added in Phase 3 (closure) and Phase 4 (codegen). */
const engines: Engine[] = [v0Engine];

for (const engine of engines) {
  describe(`conformance [${engine.name}]`, () => {
    for (const { file, case: c } of corpus) {
      const skipped = engine === v0Engine ? c.v0 === "skip" : !!c.options && !engine.supportsOptions;
      const title = `${file.replace(/\.json$/, "")}: ${c.name}`;

      if (skipped) {
        it.skip(title, () => undefined);
        continue;
      }

      it(title, () => {
        const results = executeCase(engine, c);
        const runs = runsOf(c);
        const reasons = runs.map((run, i) => checkRun(engine, run, results[i]!));

        if (engine === v0Engine && c.v0 === "differs") {
          // Known v0 divergence (bug or accepted change): v0 must still deviate, and match what we recorded about it.
          expect(reasons.some(r => r !== null), `v0 now satisfies "${c.name}" — update its v0 status`).toBe(true);
          runs.forEach((run, i) => expect(checkRecordedV0(run, results[i]!), `recorded v0 behaviour, run ${i}`).toBeNull());
        } else {
          reasons.forEach((reason, i) => expect(reason, runs.length > 1 ? `run ${i}` : undefined).toBeNull());
        }
      });
    }
  });
}
