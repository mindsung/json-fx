import type { FxFunctionDef } from "../api/types";

export const comparative: readonly FxFunctionDef[] = [
  { name: "eq", pure: true, evaluate: (a, b) => a == b, operator: { symbol: "==", precedence: 2 } },
  { name: "eqq", pure: true, evaluate: (a, b) => a === b, operator: { symbol: "===", precedence: 2 } },
  { name: "neq", pure: true, evaluate: (a, b) => a != b, operator: { symbol: "!=", precedence: 2 } },
  { name: "neqq", pure: true, evaluate: (a, b) => a !== b, operator: { symbol: "!==", precedence: 2 } },
  { name: "gt", pure: true, evaluate: (a, b) => a > b, operator: { symbol: ">", precedence: 2 } },
  { name: "gte", pure: true, evaluate: (a, b) => a >= b, operator: { symbol: ">=", precedence: 2 } },
  { name: "lt", pure: true, evaluate: (a, b) => a < b, operator: { symbol: "<", precedence: 2 } },
  { name: "lte", pure: true, evaluate: (a, b) => a <= b, operator: { symbol: "<=", precedence: 2 } }
];
