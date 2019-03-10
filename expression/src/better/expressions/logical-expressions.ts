import {Expression} from "../expression";

export const logicalExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "and",
    expression: (a: boolean, b: boolean) => a && b,
    token: { key: "&&" }
  },
  {
    key: "or",
    expression: (a: boolean, b: boolean) => a || b,
    token: { key: "||" }
  }
];
