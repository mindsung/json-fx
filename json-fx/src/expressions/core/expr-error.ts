import { FxExpressionDefinition } from "../../compiler/lexer/model/fx-definition";
import { FxCompileError } from "../../compiler/fx-error";

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
  }
];
