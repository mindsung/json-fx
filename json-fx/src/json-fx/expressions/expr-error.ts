import { FxExpressionDefinition, FxLambdaFn } from "../defs";

export const exprError: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "try",
    expression: (lambda: FxLambdaFn) => {
      try {
        lambda();
      } catch (e) {
      }
    }
  }
  /*{
    name: "notnull",
    expression: (value: any) => {
      if (value == null) {
        throw new Error("Value cannot be null.");
      }
      return value;
    }
  },
  {
    name: "assert",
    params: [
      { name: "assertTrue" },
      { name: "valueExpr", deferEvaluation: true },
      { name: "err" }
    ],
    expression: (assertTrue: any, valueExpr: ExpressionScope, err: string) => {
      if (!assertTrue) {
        throw new Error(err || "Assertion failed.");
      }
      return valueExpr != null ? valueExpr.value : true;
    }
  }*/
];
