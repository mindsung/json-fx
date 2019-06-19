import { FxExpressionDefinition } from "../defs";

export const exprLogical: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "or",
    expression: (a, b) => a || b,
    operator: { symbol: "||", precedence: 1 }
  },
  {
    name: "and",
    expression: (a, b) => a && b,
    operator: { symbol: "&&", precedence: 1.1 }
  },
  {
    name: "not",
    expression: a => !a,
    operator: { symbol: "!", precedence: 1.2, isUnary: true, assoc: "left" }
  },
  {
    name: "notnot",
    expression: a => !!a,
    operator: { symbol: "!!", precedence: 1.2, isUnary: true, assoc: "left" }
  }
];
