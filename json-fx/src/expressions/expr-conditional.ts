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
  },
  {
    name: "if",
    expression: (condition) => !!condition
  },
  {
    name: "then",
    deferEvaluation: true,
    expression: (condition: FxExpression, value: FxExpression) => {
      const evalCondition = condition.evaluate();
      return evalCondition ? value.evaluate() : evalCondition;
    }
  },
  {
    name: "else",
    deferEvaluation: true,
    expression: (condition: FxExpression, value: FxExpression) => {
      const evalCondition = condition.evaluate();
      return evalCondition ? evalCondition : value.evaluate();
    }
  }
];
