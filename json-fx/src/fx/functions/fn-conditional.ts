import { FxExpressionDefinition } from "../../model/fx-definition";
import { FxExpression } from "../../runtime/fx-expression";

export const FnConditional: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "ifElse",
    deferEvaluation: true,
    evaluate: (cond: FxExpression, thenReturn: FxExpression, elseReturn: FxExpression) =>
      cond.evaluate()
        ? thenReturn == null ? undefined : thenReturn.evaluate()
        : elseReturn == null ? undefined : elseReturn.evaluate()
  },
  {
    name: "ifNull",
    evaluate: (val, valIfNull, valIfNotNull) => val === null ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull
  },
  {
    name: "ifUndefined",
    evaluate: (val, valIfNull, valIfNotNull) => val === undefined ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull
  },
  {
    name: "ifNullOrUndefined",
    evaluate: (val, valIfNull, valIfNotNull) => val == null ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull
  }
];
