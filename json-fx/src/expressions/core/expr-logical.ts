import { FxExpressionDefinition } from "../../compiler/lexer/model/fx-definition";

export const exprLogical: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "or",
    evaluate: (a, b) => a || b,
    operator: { symbol: "||", precedence: 1 }
  },
  {
    name: "and",
    evaluate: (a, b) => a && b,
    operator: { symbol: "&&", precedence: 1.1 }
  },
  {
    name: "not",
    evaluate: a => !a,
    operator: { symbol: "!", precedence: 1.2, isUnary: true, assoc: "left" }
  },
  {
    name: "notnot",
    evaluate: a => !!a,
    operator: { symbol: "!!", precedence: 1.2, isUnary: true, assoc: "left" }
  }
];
