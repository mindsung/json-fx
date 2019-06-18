import { FxExpressionDefinition } from "../defs";

export const exprComparative: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "eq",
    expression: (a, b) => a === b,
    operator: { symbol: "==", precedence: 2 }
  },
  {
    name: "neq",
    expression: (a, b) => a !== b,
    operator: { symbol: "!=", precedence: 2 }
  },
  {
    name: "gt",
    expression: (a, b) => a > b,
    operator: { symbol: ">", precedence: 2 }
  },
  {
    name: "gte",
    expression: (a, b) => a >= b,
    operator: { symbol: ">=", precedence: 2 }
  },
  {
    name: "lt",
    expression: (a, b) => a < b,
    operator: { symbol: "<", precedence: 2 }
  },
  {
    name: "lte",
    expression: (a, b) => a <= b,
    operator: { symbol: "<=", precedence: 2 }
  }
];
