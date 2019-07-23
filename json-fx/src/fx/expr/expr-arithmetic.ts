import { FxExpressionDefinition } from "../../model/fx-definition";

export const exprArithmetic: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "add",
    evaluate: (a, b) => a + b,
    operator: { symbol: "+", precedence: 3 }
  },
  {
    name: "sub",
    evaluate: (a, b) => a - b,
    operator: { symbol: "-", precedence: 3 }
  },
  {
    name: "mul",
    evaluate: (a, b) => a * b,
    operator: { symbol: "*", precedence: 3.1 }
  },
  {
    name: "div",
    evaluate: (a, b) => a / b,
    operator: { symbol: "/", precedence: 3.1 }
  },
  {
    name: "mod",
    evaluate: (a, b) => a % b,
    operator: { symbol: "%", precedence: 3.1 }
  },
  {
    name: "pow",
    evaluate: (a, b) => Math.pow(a, b),
    operator: { symbol: "**", precedence: 3.2, assoc: "right" }
  },
  {
    name: "neg",
    evaluate: (a) => -a,
    operator: { symbol: "-u", precedence: 0, isUnary: true }
  }
];
