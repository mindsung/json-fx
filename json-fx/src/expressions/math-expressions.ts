import {Expression} from "../core/expression";

export const mathExpressions: ReadonlyArray<Expression> = [
  {
    key: "add",
    expression: (a, b) => a + b,
    token: { key: "+", precedence: 3 }
  },
  {
    key: "sub",
    expression: (a, b) => a - b,
    token: { key: "-", precedence: 3 }
  },
  {
    key: "mul",
    expression: (a, b) => a * b,
    token: { key: "*", precedence: 4 }
  },
  {
    key: "div",
    expression: (a, b) => a / b,
    token: { key: "/", precedence: 4 }
  }
];
