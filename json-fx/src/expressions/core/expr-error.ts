import {FxExpressionDefinition} from "../../defs";
import {FxCompileError} from "../../compiler/fx-error";

export const exprError: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "notnull",
    expression: (value: any) => {
      if (value == null) {
        throw new FxCompileError("Value cannot be null.");
      } else {
        return value;
      }
    }
  }
];
