import {Expression} from "../core/expression";

export const comparativeExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "eq",
    expression: (a, b) => a === b,
    token: { key: "==", precedence: 2 }
  },
  {
    key: "neq",
    expression: (a, b) => a !== b,
    token: { key: "!=", precedence: 2 }
  },
  {
    key: "gt",
    expression: (a, b) => a > b,
    token: { key: ">", precedence: 2 }
  },
  {
    key: "gte",
    expression: (a, b) => a >= b,
    token: { key: ">=", precedence: 2 }
  },
  {
    key: "lt",
    expression: (a, b) => a < b,
    token: { key: "<", precedence: 2 }
  },
  {
    key: "lte",
    expression: (a, b) => a <= b,
    token: { key: "<=", precedence: 2 }
  }
];
