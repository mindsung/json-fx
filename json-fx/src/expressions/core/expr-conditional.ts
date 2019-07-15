import { FxExpressionDefinition } from "../../compiler/lexer/model/fx-definition";
import { FxExpression } from "../../compiler/runtime/model/fx-expression";

export const exprConditional: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "ifelse",
    deferEvaluation: true,
    evaluate: (cond: FxExpression, thenReturn: FxExpression, elseReturn: FxExpression) =>
      cond.evaluate()
        ? thenReturn == null ? null : thenReturn.evaluate()
        : elseReturn == null ? null : elseReturn.evaluate()
  },
  {
    name: "for",
    evaluate: (start, end, lambda) => {
      const result = [];

      for (let i = start; i < end; i++) {
        result.push(lambda(i));
      }

      return result;
    }
  },
  {
    name: "if",
    evaluate: (condition) => !!condition
  },
  {
    name: "then",
    deferEvaluation: true,
    evaluate: (condition: FxExpression, value: FxExpression) => {
      const evalCondition = condition.evaluate();
      return evalCondition ? value.evaluate() : evalCondition;
    }
  },
  {
    name: "else",
    deferEvaluation: true,
    evaluate: (condition: FxExpression, value: FxExpression) => {
      const evalCondition = condition.evaluate();
      return evalCondition ? evalCondition : value.evaluate();
    }
  }
];
