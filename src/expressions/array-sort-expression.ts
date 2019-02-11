import { Expression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";
import { TransformExpression } from "../core/transform-expression";
import { ValueType } from "../core/value-type";

export type SortDirection = "asc" | "desc";

export class ArraySortExpression<TIn extends Array<TItem>, TItem, TValue extends ValueType> extends ArrayExpression<TIn, TItem, Array<TItem>> {
  constructor(input: Expression<TIn>, private params: [ TransformExpression<TItem, TValue>, Expression<SortDirection> ]) {
    super(input, params);
  }

  transform(inputValue: TIn) {
    const directionValue = this.params.length > 1 ? this.params[1].evaluate() : "asc";
    // inputValue.concat() will clone the array. Array.sort mutates the existing array, not what we want.
    return inputValue.concat().sort((item1, item2) => {
      return this.evaluateForItem(item1, this.params[0]) < this.evaluateForItem(item2, this.params[0])
        ? (directionValue == "asc" ? -1 : 1)
        : (directionValue == "asc" ? 1 : -1);
    });
  }
}
