import { describe, expect, it } from "vitest";
import { createRegistry } from "../src/stdlib";
import { TemplateReader } from "../src/syntax/template-reader";
import { FxCompileError, FxSyntaxError } from "../src/errors";
import { loadCorpus } from "./harness/corpus";
import { makeTestFunctions } from "./harness/fixtures";

/**
 * Phase 2 exit criterion (V1-PLAN.md §8): every corpus template parses to an AST, or produces the expected syntax error.
 * Errors that belong to later phases (resolution, arity, cycles, run time) must NOT surface while parsing.
 */
const corpus = loadCorpus();

/** Compile errors raised while reading (object shape rules), as opposed to by the resolver. */
const isReaderCompileError = (tags: readonly string[] = []): boolean => tags.includes("promotion");

describe("corpus parses", () => {
  for (const { file, case: c } of corpus) {
    it(`${file}: ${c.name}`, () => {
      const registry = createRegistry(makeTestFunctions(c.functions).defs);
      const reader = new TemplateReader(registry);
      const errors = (c.runs ?? [c]).map(r => r.expectError).filter(Boolean);
      const syntaxError = errors.some(e => e?.type === "FxSyntaxError");

      if (syntaxError) {
        expect(() => reader.read(c.template)).toThrow(FxSyntaxError);
      } else if (isReaderCompileError(c.tags) && errors.some(e => e?.type === "FxCompileError")) {
        expect(() => reader.read(c.template)).toThrow(FxCompileError);
      } else {
        expect(() => reader.read(c.template)).not.toThrow();
      }
    });
  }
});
