import { Expression } from "../core/expression";
import { arrayExpressions } from "./array-expressions";
import { arithmeticExpressions } from "./arithmetic-expressions";
import { comparativeExpressions } from "./comparative-expressions";
import { logicalExpressions } from "./logical-expressions";
import { conditionalExpressions } from "./conditional-expressions";
import { errorExpressions } from "./error-expressions";
import { mathExpressions } from "./math-expressions";
import { stringExpressions } from "./string-expressions";

export * from "./core-expressions";
export * from "./array-expressions";
export * from "./arithmetic-expressions";
export * from "./math-expressions";
export * from "./comparative-expressions";
export * from "./logical-expressions";
export * from "./conditional-expressions";
export * from "./error-expressions";

export const stockExpressions: ReadonlyArray<Expression> = []
.concat(arrayExpressions)
.concat(arithmeticExpressions)
.concat(mathExpressions)
.concat(comparativeExpressions)
.concat(logicalExpressions)
.concat(conditionalExpressions)
.concat(errorExpressions)
.concat(stringExpressions);
