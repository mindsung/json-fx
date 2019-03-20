import { Expression, ExpressionScope } from "..";

export const logicalExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "or",
    params: [{ name: "a" }, { name: "bExpr", deferEvaluation: true }],
    expression: (a: any, bExpr: ExpressionScope) => a || bExpr.value,
    token: { key: "||", precedence: 1 }
  },
  {
    key: "and",
    params: [{ name: "a" }, { name: "bExpr", deferEvaluation: true }],
    expression: (a: any, bExpr: ExpressionScope) => a && bExpr.value,
    token: { key: "&&", precedence: 1.1 }
  },
  {
    key: "not",
    expression: (a: any) => !a,
    token: { key: "!", precedence: 1.2, operandOn: "right" }
  },
  {
    key: "notnot",
    expression: (a: any) => !!a,
    token: { key: "!!", precedence: 1.2, operandOn: "right" }
  }
];
