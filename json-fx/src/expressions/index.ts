import { Expression } from "../core/expression";
import { arrayExpressions } from "./array-expressions";
import { mathExpressions } from "./math-expressions";
import { comparativeExpressions } from "./comparative-expressions";
import { logicalExpressions } from "./logical-expressions";
import { conditionalExpressions } from "./conditional-expressions";

export * from "./core-expressions";
export * from "./array-expressions";
export * from "./math-expressions";
export * from "./comparative-expressions";
export * from "./conditional-expressions";

export const stockExpressions: ReadonlyArray<Expression> = []
  .concat(arrayExpressions)
  .concat(mathExpressions)
  .concat(comparativeExpressions)
  .concat(logicalExpressions)
  .concat(conditionalExpressions);
