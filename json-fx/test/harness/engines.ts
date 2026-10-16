import { JsonFx as JsonFxV0 } from "json-fx-v0";
import { JsonFx as JsonFxV1 } from "../../src";
import type { TestFunctionDef } from "./fixtures";

/** Compile-time options a conformance case can pass (v1 only). */
export interface EngineCompileOptions {
  inputs?: string[];
  strictIdentifiers?: boolean;
}

export interface EngineTemplate {
  /** Evaluates against exactly these inputs ({ "$": value, "$other": value }); no state may leak between calls. */
  run(inputs: Record<string, unknown>): unknown;
}

/** Adapter that lets the conformance runner and the compare harness drive any engine the same way. */
export interface Engine {
  readonly name: string;
  /** Whether error `type` and `phase` expectations can be checked (v0 throws FxCompileError for everything). */
  readonly strictErrors: boolean;
  /** Whether `options` are honoured. */
  readonly supportsOptions: boolean;
  compile(template: unknown, functions: readonly TestFunctionDef[], options?: EngineCompileOptions): EngineTemplate;
}

/** The published @mindsung/json-fx 0.1.25, installed under the alias `json-fx-v0`. */
export const v0Engine: Engine = {
  name: "v0",
  strictErrors: false,
  supportsOptions: false,
  compile(template, functions) {
    const compiled = new JsonFxV0(functions as any[]).compile(template as any);
    return {
      run(inputs) {
        // v0's evaluate() is stateful (inputs persist between calls); reset so each run is pure.
        compiled.clearInputs();
        return compiled.evaluate(...Object.entries(inputs).map(([name, value]) => ({ name, value })));
      }
    };
  }
};

/** Thrown by an engine adapter whose implementation doesn't exist yet. */
export class EngineUnavailableError extends Error {}

/** v1 with the closure backend. */
export const v1ClosureEngine: Engine = {
  name: "v1-closure",
  strictErrors: true,
  supportsOptions: true,
  compile(template, functions, options) {
    const compiled = new JsonFxV1({ functions: [functions as any[]], backend: "closure" }).compile(template, options);
    return { run: (inputs) => compiled.run(inputs) };
  }
};

/** v1 with the JS code generator. */
export const v1CodegenEngine: Engine = {
  name: "v1-codegen",
  strictErrors: true,
  supportsOptions: true,
  compile(template, functions, options) {
    const compiled = new JsonFxV1({ functions: [functions as any[]], backend: "codegen" }).compile(template, options);
    return { run: (inputs) => compiled.run(inputs) };
  }
};

/** The v1 engine the compare harness diffs against v0: the default backend (`auto`, i.e. codegen where `new Function` works). */
export const v1Engine: Engine = { ...v1CodegenEngine, name: "v1" };
