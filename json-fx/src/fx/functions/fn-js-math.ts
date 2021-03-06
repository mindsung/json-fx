import { FxExpressionDefinition } from "../../model/fx-definition";
import { isFunction, isNumber } from "../../common";

export const FnJsMath: ReadonlyArray<FxExpressionDefinition> = Object.getOwnPropertyNames(Math).map(key => {
  const prop = Math[key];
  const x = isFunction(prop) ? (...params: any[]): any => prop(...params) : isNumber(prop) ? () => prop : null;
  return {
    name: "math~" + key,
    evaluate: x
  };
}).filter(expr => expr.evaluate != null);
