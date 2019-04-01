import { Expression } from "../core/expression";

export const fxComparativeExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "eq",
    expression: (a, b) => a === b,
    operator: { key: "==", precedence: 2 }
  },
  {
    key: "neq",
    expression: (a, b) => a !== b,
    operator: { key: "!=", precedence: 2 }
  },
  {
    key: "gt",
    expression: (a, b) => a > b,
    operator: { key: ">", precedence: 2 }
  },
  {
    key: "gte",
    expression: (a, b) => a >= b,
    operator: { key: ">=", precedence: 2 }
  },
  {
    key: "lt",
    expression: (a, b) => a < b,
    operator: { key: "<", precedence: 2 }
  },
  {
    key: "lte",
    expression: (a, b) => a <= b,
    operator: { key: "<=", precedence: 2 }
  }
];
