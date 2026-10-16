import type { FxFunctionDef } from "../api/types";
import { inline } from "../backend/js/emit";

export const arithmetic: readonly FxFunctionDef[] = [
  { name: "add", pure: true, emit: inline.binary("+"), evaluate: (a, b) => a + b, operator: { symbol: "+", precedence: 3 } },
  { name: "sub", pure: true, emit: inline.binary("-"), evaluate: (a, b) => a - b, operator: { symbol: "-", precedence: 3 } },
  { name: "mul", pure: true, emit: inline.binary("*"), evaluate: (a, b) => a * b, operator: { symbol: "*", precedence: 3.1 } },
  { name: "div", pure: true, emit: inline.binary("/"), evaluate: (a, b) => a / b, operator: { symbol: "/", precedence: 3.1 } },
  { name: "mod", pure: true, emit: inline.binary("%"), evaluate: (a, b) => a % b, operator: { symbol: "%", precedence: 3.1 } },
  { name: "pow", pure: true, emit: (a) => (a.length === 2 ? `Math.pow(${a[0]}, ${a[1]})` : undefined), evaluate: (a, b) => Math.pow(a, b), operator: { symbol: "**", precedence: 3.2, assoc: "right" } },
  // v0 registered this as the internal symbol `-u`; in v1 the parser picks unary or binary `-` by position.
  { name: "neg", pure: true, emit: inline.unary("-"), evaluate: (a) => -a, operator: { symbol: "-", precedence: 0, isUnary: true } }
];
