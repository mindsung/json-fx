import type { FxFunctionDef, FxLazyArg } from "../api/types";

export const conditional: readonly FxFunctionDef[] = [
  {
    name: "ifElse",
    deferEvaluation: true,
    intrinsic: "ifElse",
    // Fallback only: `ifElse(c, a, b)` is lowered by the parser to a `cond` node.
    evaluate: (cond: FxLazyArg, thenReturn?: FxLazyArg, elseReturn?: FxLazyArg) =>
      cond.evaluate()
        ? thenReturn == null ? undefined : thenReturn.evaluate()
        : elseReturn == null ? undefined : elseReturn.evaluate()
  },
  { name: "ifNull", pure: true, evaluate: (val, valIfNull, valIfNotNull) => val === null ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull },
  { name: "ifUndefined", pure: true, evaluate: (val, valIfNull, valIfNotNull) => val === undefined ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull },
  { name: "ifNullOrUndefined", pure: true, evaluate: (val, valIfNull, valIfNotNull) => val == null ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull }
];
