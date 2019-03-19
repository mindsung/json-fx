import { Expression, ExpressionScope } from "../core/expression";
import { createExpressionConstant } from "./core-expressions";

export const conditionalExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "ifelse",
    params: [
      { name: "cond" },
      { name: "thenExpr", deferEvaluation: true },
      { name: "elseExpr", deferEvaluation: true }
    ],
    expression: (cond: any, thenExpr: ExpressionScope, elseExpr: ExpressionScope) =>
      cond ? thenExpr.value : elseExpr != null ? elseExpr.value : null
  },
  {
    key: "nullor",
    params: [
      { name: "value" },
      { name: "thenExpr", deferEvaluation: true }
    ],
    expression: (value: any, thenExpr: ExpressionScope) => {
      if (value == null) { return null; }
      let origParams = thenExpr["_orig_params"];
      if (origParams == null) {
        thenExpr["_orig_params"] = origParams = thenExpr.params;
      }
      thenExpr.params = [createExpressionConstant(value)].concat(origParams);
      return thenExpr.value;
    },
    token: { key: "?", precedence: 0.1 }
  }
];
