import { Expression, ExpressionScope } from "../core/expression";
import { createExpressionConstant } from "./core-expressions";

export const conditionalExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "nullcond",
    params: [
      { name: "nullEval" },
      { name: "thenExpr", deferEvaluation: true }
    ],
    expression: (nullEval: any, thenExpr: ExpressionScope) => {
      if (nullEval == null) { return null; }
      let origParams = thenExpr["_orig_params"];
      if (origParams == null) {
        thenExpr["_orig_params"] = origParams = thenExpr.params;
      }
      thenExpr.params = [createExpressionConstant(nullEval)].concat(origParams);
      return thenExpr.value;
    },
    token: { key: "?", precedence: 0.1 }
  }
];
