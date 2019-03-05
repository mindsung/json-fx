import {Expression} from "../expression";

export const mathExpressions: ReadonlyArray<Expression> = [
  {
    key: "add",
    expression: (a, b) => a + b,
    token: { key: "+" }
  },
  {
    key: "sub",
    expression: (a, b) => a - b,
    token: { key: "-" }
  },
  {
    key: "mul",
    expression: (a, b) => a * b,
    token: { key: "*" }
  },
  {
    key: "div",
    expression: (a, b) => a / b,
    token: { key: "/" }
  }
];
