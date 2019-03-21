import { Expression } from "../core/expression";
import { isFunction, isNumber } from "../core/common";

export const mathExpressions: ReadonlyArray<Expression> = Object.getOwnPropertyNames(Math).map(key => {
  const prop = Math[key];
  const x = isFunction(prop) ? (...params: any[]): any => prop(...params) : isNumber(prop) ? () => prop : null;
  return {
    key: "math~" + key,
    expression: x
  };
}).filter(expr => expr.expression != null);
