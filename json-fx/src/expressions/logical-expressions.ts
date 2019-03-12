import {Expression} from "../core/expression";

export const logicalExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "or",
    expression: (a: boolean, b: boolean) => a || b,
    token: { key: "||", precedence: 1 }
  },
  {
    key: "and",
    expression: (a: boolean, b: boolean) => a && b,
    token: { key: "&&", precedence: 1.1 }
  }
];
