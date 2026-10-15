import type { FxFunctionDef } from "../api/types";

export const arithmetic: readonly FxFunctionDef[] = [
  { name: "add", pure: true, evaluate: (a, b) => a + b, operator: { symbol: "+", precedence: 3 } },
  { name: "sub", pure: true, evaluate: (a, b) => a - b, operator: { symbol: "-", precedence: 3 } },
  { name: "mul", pure: true, evaluate: (a, b) => a * b, operator: { symbol: "*", precedence: 3.1 } },
  { name: "div", pure: true, evaluate: (a, b) => a / b, operator: { symbol: "/", precedence: 3.1 } },
  { name: "mod", pure: true, evaluate: (a, b) => a % b, operator: { symbol: "%", precedence: 3.1 } },
  { name: "pow", pure: true, evaluate: (a, b) => Math.pow(a, b), operator: { symbol: "**", precedence: 3.2, assoc: "right" } },
  // v0 registered this as the internal symbol `-u`; in v1 the parser picks unary or binary `-` by position.
  { name: "neg", pure: true, evaluate: (a) => -a, operator: { symbol: "-", precedence: 0, isUnary: true } }
];
