import {FxExpressionDefinition} from "../../defs";

export const exprArithmetic: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "add",
    expression: (a, b) => a + b,
    operator: {symbol: "+", precedence: 3}
  },
  {
    name: "sub",
    expression: (a, b) => a - b,
    operator: {symbol: "-", precedence: 3}
  },
  {
    name: "mul",
    expression: (a, b) => a * b,
    operator: {symbol: "*", precedence: 3.1}
  },
  {
    name: "div",
    expression: (a, b) => a / b,
    operator: {symbol: "/", precedence: 3.1}
  },
  {
    name: "mod",
    expression: (a, b) => a % b,
    operator: {symbol: "%", precedence: 3.1}
  },
  {
    name: "pow",
    expression: (a, b) => Math.pow(a, b),
    operator: {symbol: "**", precedence: 3.2}
  }
];
