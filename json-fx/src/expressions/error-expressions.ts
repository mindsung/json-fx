import { Expression, ExpressionScope } from "../core/expression";

export const errorExpressions: ReadonlyArray<Expression<boolean>> = [
  {
    key: "notnull",
    expression: (value: any) => {
      if (value == null) {
        throw new Error("Value cannot be null.");
      }
      return value;
    }
  },
  {
    key: "assert",
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
  }
];
