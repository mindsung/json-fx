import {arrayExpressions, comparativeExpressions, mathExpressions} from ".";
import {Expression} from "../expression";
import { logicalExpressions } from "./logical-expressions";

export const stockExpressions: ReadonlyArray<Expression> = []
  .concat(arrayExpressions)
  .concat(mathExpressions)
  .concat(comparativeExpressions)
  .concat(logicalExpressions);
