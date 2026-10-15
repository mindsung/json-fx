import { JsonFx as JsonFxV0 } from "json-fx-v0";
import { JsonFx as JsonFxV1 } from "../src-v1";

/** A compiled single-input transform: `$` is the only input. */
export type BenchFn = (input: unknown) => unknown;

export interface BenchEngine {
  name: string;
  /** Returns null when the engine isn't available yet (e.g. v1 before its implementation lands). */
  compile(template: unknown): BenchFn | null;
}

/** v0 via the published 0.1.25 build. Calls evaluate() directly (the same call V1-PLAN.md §3.1 measured). */
export const benchV0: BenchEngine = {
  name: "v0",
  compile(template) {
    const compiled = new JsonFxV0().compile(template as any);
    return (input) => compiled.evaluate({ name: "$", value: input });
  }
};

/** v1 closure backend, through the pure `run()` path. */
export const benchV1Closure: BenchEngine = {
  name: "v1-closure",
  compile(template) {
    const compiled = new JsonFxV1({ backend: "closure" }).compile(template);
    return (input) => compiled.run({ $: input });
  }
};

/** v1 JS code generator, through the pure `run()` path. */
export const benchV1Codegen: BenchEngine = {
  name: "v1-codegen",
  compile(template) {
    const compiled = new JsonFxV1({ backend: "codegen" }).compile(template);
    return (input) => compiled.run({ $: input });
  }
};

/** The code generator with the optimizer off, to show what the optimizer adds. */
export const benchV1CodegenNoOpt: BenchEngine = {
  name: "v1-codegen-noopt",
  compile(template) {
    const compiled = new JsonFxV1({ backend: "codegen", optimize: false }).compile(template);
    return (input) => compiled.run({ $: input });
  }
};

export const benchEngines: BenchEngine[] = [benchV0, benchV1Closure, benchV1CodegenNoOpt, benchV1Codegen];
