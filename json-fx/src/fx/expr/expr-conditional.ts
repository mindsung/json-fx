import { FxExpressionDefinition } from "../../model/fx-definition";
import { FxExpression } from "../../runtime/fx-expression";

export const ExprConditional: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "ifElse",
    deferEvaluation: true,
    evaluate: (cond: FxExpression, thenReturn: FxExpression, elseReturn: FxExpression) =>
      cond.evaluate()
        ? thenReturn == null ? undefined : thenReturn.evaluate()
        : elseReturn == null ? undefined : elseReturn.evaluate()
  },
  {
    name: "isNull",
    evaluate: val => val === null
  },
  {
    name: "ifNull",
    evaluate: (val, valIfNull, valIfNotNull) => val === null ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull
  },
  {
    name: "isUndefined",
    evaluate: val => val === undefined
  },
  {
    name: "ifUndefined",
    evaluate: (val, valIfNull, valIfNotNull) => val === undefined ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull
  },
  {
    name: "isNullOrUndefined",
    evaluate: val => val == null
  },
  {
    name: "ifNullOrUndefined",
    evaluate: (val, valIfNull, valIfNotNull) => val == null ? valIfNull : valIfNotNull === undefined ? val : valIfNotNull
  },
  {
    name: "hasValue",
    evaluate: val => val != null
  }
  // {
  //   name: "if",
  //   evaluate: (condition) => !!condition
  // },
  // {
  //   name: "then",
  //   deferEvaluation: true,
  //   evaluate: (condition: FxExpression, value: FxExpression) => {
  //     const evalCondition = condition.evaluate();
  //     return evalCondition ? value.evaluate() : evalCondition;
  //   }
  // },
  // {
  //   name: "else",
  //   deferEvaluation: true,
  //   evaluate: (condition: FxExpression, value: FxExpression) => {
  //     const evalCondition = condition.evaluate();
  //     return evalCondition ? evalCondition : value.evaluate();
  //   }
  // }
];
