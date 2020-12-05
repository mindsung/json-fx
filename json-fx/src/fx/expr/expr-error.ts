import { FxExpressionDefinition } from "../../model/fx-definition";
import { FxCompileError } from "../../model/fx-error";
import { FxExpression } from "../../runtime/fx-expression";

export const ExprError: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "notNull",
    evaluate: (value: any) => {
      if (value == null) {
        throw new FxCompileError("Value cannot be null.");
      } else {
        return value;
      }
    }
  },
  {
    name: "throw",
    deferEvaluation: true,
    evaluate: (arg: FxExpression) => {
      const message = arg.evaluate();
      throw new FxCompileError(message, arg.sourceRef);
    }
  },
  {
    name: "catch",
    deferEvaluation: true,
    evaluate: (value: FxExpression, catchValue: FxExpression) => {
      try {
        return value.evaluate();
      } catch (e) {
        return catchValue ? catchValue.evaluate() : null;
      }
    }
  }
];
