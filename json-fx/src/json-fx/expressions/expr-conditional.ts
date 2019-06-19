import { FxExpressionDefinition } from "../defs";
import { FxExpression } from "../compiler/runtime/model/fx-expression";

export const exprConditional: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "ifelse",
    deferEvaluation: true,
    expression: (cond: FxExpression, thenReturn: FxExpression, elseReturn: FxExpression) =>
      cond.evaluate()
        ? thenReturn == null ? null : thenReturn.evaluate()
        : elseReturn == null ? null : elseReturn.evaluate()
  },
  {
    name: "for",
    expression: (start, end, lambda) => {
      const result = [];

      for (let i = start; i < end; i++) {
        result.push(lambda(i));
      }

      return result;
    }
  }

  // Missing: nullor

  /*{
    name: "nullor",
    params: [
      { name: "value" },
      { name: "thenExpr", deferEvaluation: true }
    ],
    expression: (value: any, thenExpr: ExpressionScope) => {
      if (value == null) {
        return null;
      }
      let origParams = thenExpr["_orig_params"];
      if (origParams == null) {
        thenExpr["_orig_params"] = origParams = thenExpr.params;
      }
      thenExpr.params = [createExpressionConstant(value)].concat(origParams);
      return thenExpr.value;
    },
    operator: { symbol: "?", precedence: 99 }
  }*/
];
