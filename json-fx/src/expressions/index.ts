import { Expression } from "../core/expression";
import { arrayExpressions } from "./array-expressions";
import { mathExpressions } from "./math-expressions";
import { comparativeExpressions } from "./comparative-expressions";
import { logicalExpressions } from "./logical-expressions";
import { conditionalExpressions } from "./conditional-expressions";
import { errorExpressions } from "./error-expressions";
import { jsMathExpressions } from "./js-math-expressions";

export * from "./core-expressions";
export * from "./array-expressions";
export * from "./math-expressions";
export * from "./js-math-expressions";
export * from "./comparative-expressions";
export * from "./logical-expressions";
export * from "./conditional-expressions";
export * from "./error-expressions";

export const stockExpressions: ReadonlyArray<Expression> = []
  .concat(arrayExpressions)
  .concat(mathExpressions)
  .concat(jsMathExpressions)
  .concat(comparativeExpressions)
  .concat(logicalExpressions)
  .concat(conditionalExpressions)
  .concat(errorExpressions);
