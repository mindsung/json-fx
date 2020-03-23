import { FxExpressionDefinition } from "../../model/fx-definition";
import { FxExpression } from "../../runtime/fx-expression";

export const ExprConditional: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "ifelse",
    deferEvaluation: true,
    evaluate: (cond: FxExpression, thenReturn: FxExpression, elseReturn: FxExpression) =>
      cond.evaluate()
        ? thenReturn == null ? undefined : thenReturn.evaluate()
        : elseReturn == null ? undefined : elseReturn.evaluate()
  },
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
