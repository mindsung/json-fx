import type { FxFunctionDef } from "../api/types";

// `and` / `or` are lowered by the parser to short-circuiting `logical` nodes; `evaluate` is the fallback for
// shapes that aren't lowered (wrong arity is reported by the resolver).
export const logical: readonly FxFunctionDef[] = [
  { name: "or", pure: true, intrinsic: "or", evaluate: (a, b) => a || b, operator: { symbol: "||", precedence: 1 } },
  { name: "and", pure: true, intrinsic: "and", evaluate: (a, b) => a && b, operator: { symbol: "&&", precedence: 1.1 } },
  { name: "not", pure: true, evaluate: (a) => !a, operator: { symbol: "!", precedence: 1.2, isUnary: true } },
  { name: "notNot", pure: true, evaluate: (a) => !!a, operator: { symbol: "!!", precedence: 1.2, isUnary: true } }
  // v0's stray postfix `?` ("funny", B12) is removed.
];
