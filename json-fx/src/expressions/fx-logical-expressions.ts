import { Expression, ExpressionScope } from "..";

export const fxLogicalExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "or",
    params: [{ name: "a" }, { name: "bExpr", deferEvaluation: true }],
    expression: (a: any, bExpr: ExpressionScope) => a || bExpr.value,
    operator: { key: "||", precedence: 1 }
  },
  {
    key: "and",
    params: [{ name: "a" }, { name: "bExpr", deferEvaluation: true }],
    expression: (a: any, bExpr: ExpressionScope) => a && bExpr.value,
    operator: { key: "&&", precedence: 1.1 }
  },
  {
    key: "not",
    expression: (a: any) => !a,
    operator: { key: "!", precedence: 1.2, isUnary: true, assoc: "left" }
  },
  {
    key: "notnot",
    expression: (a: any) => !!a,
    operator: { key: "!!", precedence: 1.2, isUnary: true, assoc: "left" }
  }
];
