import {Expression} from "../expression";

export const comparativeExpressions: ReadonlyArray<Expression> = [
  {
    key: "eq",
    expression: (a, b) => a === b,
    token: { key: "==" }
  },
  {
    key: "neq",
    expression: (a, b) => a !== b,
    token: { key: "!=" }
  },
  {
    key: "gt",
    expression: (a, b) => a > b,
    token: { key: ">" }
  },
  {
    key: "gte",
    expression: (a, b) => a >= b,
    token: { key: ">=" }
  },
  {
    key: "lt",
    expression: (a, b) => a < b,
    token: { key: "<" }
  },
  {
    key: "lte",
    expression: (a, b) => a <= b,
    token: { key: "<=" }
  }
];
