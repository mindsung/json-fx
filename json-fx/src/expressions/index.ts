import { Expression } from "../core/expression";
import { fxArrayExpressions } from "./fx-array-expressions";
import { fxArithmeticExpressions } from "./fx-arithmetic-expressions";
import { fxComparativeExpressions } from "./fx-comparative-expressions";
import { fxLogicalExpressions } from "./fx-logical-expressions";
import { fxConditionalExpressions } from "./fx-conditional-expressions";
import { fxErrorExpressions } from "./fx-error-expressions";
import { fxMathExpressions } from "./fx-math-expressions";
import { fxStringExpressions } from "./fx-string-expressions";
import { fxCoreExpressions } from "./fx-core-expressions";

export * from "./fx-core-expressions";
export * from "./fx-array-expressions";
export * from "./fx-arithmetic-expressions";
export * from "./fx-math-expressions";
export * from "./fx-comparative-expressions";
export * from "./fx-logical-expressions";
export * from "./fx-conditional-expressions";
export * from "./fx-error-expressions";

export const stockExpressions: ReadonlyArray<Expression> = []
  .concat(fxCoreExpressions)
  .concat(fxArrayExpressions)
  .concat(fxArithmeticExpressions)
  .concat(fxMathExpressions)
  .concat(fxComparativeExpressions)
  .concat(fxLogicalExpressions)
  .concat(fxConditionalExpressions)
  .concat(fxErrorExpressions)
  .concat(fxStringExpressions);
