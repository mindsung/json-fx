/** An extension-function definition; structurally compatible with v0's FxExpressionDefinition and v1's FxFunctionDef. */
export interface TestFunctionDef {
  name: string;
  evaluate: (...args: any[]) => any;
  deferEvaluation?: boolean;
}

export interface TestFunctions {
  defs: TestFunctionDef[];
  /** Invocation counts per function name since the last `resetCalls()`. */
  calls: Record<string, number>;
  resetCalls(): void;
}

type FunctionFactory = (hit: () => number, state: { counter: number }) => Omit<TestFunctionDef, "name">;

const FUNCTION_FACTORIES: Record<string, FunctionFactory> = {
  /** Identity that counts how often it is called (B1: receiver evaluated once). */
  tick: (hit) => ({ evaluate: (v: any) => { hit(); return v; } }),
  /** Impure: returns 1, 2, 3, ... across evaluations of one compiled case (B15). */
  counter: (hit, state) => ({ evaluate: () => { hit(); return ++state.counter; } }),
  /** README example extension function. */
  addFive: () => ({ evaluate: (n: number) => n + 5 })
};

/** Builds fresh test functions (and counters) for one case. Unknown names are a corpus error. */
export function makeTestFunctions(names: readonly string[] = []): TestFunctions {
  const calls: Record<string, number> = {};
  const state = { counter: 0 };
  const defs = names.map(name => {
    const factory = FUNCTION_FACTORIES[name];
    if (!factory) { throw new Error(`Unknown test function "${name}"`); }
    return { name, ...factory(() => (calls[name] = (calls[name] ?? 0) + 1), state) };
  });
  return {
    defs,
    calls,
    resetCalls: () => { for (const k of Object.keys(calls)) { delete calls[k]; } }
  };
}

class Greeter {
  public readonly own = "own-data";
  public greet(): string { return "hello"; }
}

const proto = { inheritedFn: () => "inherited", inheritedData: "inherited-data" };

const FIXTURES: Record<string, () => unknown> = {
  /** Own-property host callback: must stay callable (V1-PLAN.md §4.6). */
  fmt: () => (n: unknown) => "#" + n,
  /** Class instance: `own` is an own data property; `greet` and `constructor` are inherited. */
  greeter: () => new Greeter(),
  /** Plain object whose prototype carries a function and a data property. */
  protoBacked: () => Object.assign(Object.create(proto), { own: "own-data" })
};

const FIXTURE_KEY = "$$fixture";
const UNDEFINED_KEY = "$$undefined";

/** Decodes the `$$undefined` / `$$fixture` sentinels anywhere inside a JSON-ish value. */
export function decode(value: unknown): unknown {
  if (Array.isArray(value)) { return value.map(decode); }
  if (value !== null && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (UNDEFINED_KEY in o) { return undefined; }
    if (FIXTURE_KEY in o) {
      const make = FIXTURES[String(o[FIXTURE_KEY])];
      if (!make) { throw new Error(`Unknown fixture "${String(o[FIXTURE_KEY])}"`); }
      return make();
    }
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, decode(v)]));
  }
  return value;
}

export function knownFunctionNames(): string[] { return Object.keys(FUNCTION_FACTORIES); }
export function knownFixtureNames(): string[] { return Object.keys(FIXTURES); }
