import {arrayExpressions, comparativeExpressions, mathExpressions} from "./expressions";
import {Expression} from "./expression";

export const stockExpressions: ReadonlyArray<Expression> = []
  .concat(arrayExpressions)
  .concat(mathExpressions)
  .concat(comparativeExpressions);
