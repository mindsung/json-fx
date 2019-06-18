import { FxExpressionDefinition } from "../defs";

export const exprConditional: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "ifelse",
    expression: (cond, thenReturn, elseReturn) => cond ? thenReturn : elseReturn
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
