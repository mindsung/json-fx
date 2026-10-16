import type { FxFunctionDef } from "../api/types";
import { inline } from "../backend/js/emit";

export const comparative: readonly FxFunctionDef[] = [
  { name: "eq", pure: true, emit: inline.binary("=="), evaluate: (a, b) => a == b, operator: { symbol: "==", precedence: 2 } },
  { name: "eqq", pure: true, emit: inline.binary("==="), evaluate: (a, b) => a === b, operator: { symbol: "===", precedence: 2 } },
  { name: "neq", pure: true, emit: inline.binary("!="), evaluate: (a, b) => a != b, operator: { symbol: "!=", precedence: 2 } },
  { name: "neqq", pure: true, emit: inline.binary("!=="), evaluate: (a, b) => a !== b, operator: { symbol: "!==", precedence: 2 } },
  { name: "gt", pure: true, emit: inline.binary(">"), evaluate: (a, b) => a > b, operator: { symbol: ">", precedence: 2 } },
  { name: "gte", pure: true, emit: inline.binary(">="), evaluate: (a, b) => a >= b, operator: { symbol: ">=", precedence: 2 } },
  { name: "lt", pure: true, emit: inline.binary("<"), evaluate: (a, b) => a < b, operator: { symbol: "<", precedence: 2 } },
  { name: "lte", pure: true, emit: inline.binary("<="), evaluate: (a, b) => a <= b, operator: { symbol: "<=", precedence: 2 } }
];
