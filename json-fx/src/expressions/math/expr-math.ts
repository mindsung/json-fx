import { FxExpressionDefinition } from "../../defs";
import { isFunction, isNumber } from "../../common";

export const exprMath: ReadonlyArray<FxExpressionDefinition> = Object.getOwnPropertyNames(Math).map(key => {
  const prop = Math[key];
  const x = isFunction(prop) ? (...params: any[]): any => prop(...params) : isNumber(prop) ? () => prop : null;
  return {
    name: "math~" + key,
    expression: x
  };
}).filter(expr => expr.expression != null);
