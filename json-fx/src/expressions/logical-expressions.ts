import {Expression} from "../core/expression";

export const logicalExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "and",
    expression: (a: boolean, b: boolean) => a && b,
    token: { key: "&&", precedence: 1 }
  },
  {
    key: "or",
    expression: (a: boolean, b: boolean) => a || b,
    token: { key: "||", precedence: 1 }
  }
];
