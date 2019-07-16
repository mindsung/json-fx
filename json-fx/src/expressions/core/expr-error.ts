import { FxExpressionDefinition } from "../../compiler/lexer/model/fx-definition";
import { FxCompileError } from "../../compiler/fx-error";
import { FxExpression } from "../../compiler/runtime/model/fx-expression";

export const exprError: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "notnull",
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
