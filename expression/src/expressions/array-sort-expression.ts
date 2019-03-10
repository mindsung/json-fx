import { OldExpression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";
import { TransformExpression } from "../core/transform-expression";
import { ValueType } from "../core/value-type";

export type SortDirection = "asc" | "desc";

export class ArraySortExpression<TIn extends Array<TItem>, TItem, TValue extends ValueType> extends ArrayExpression<TIn, TItem, Array<TItem>> {
  constructor(input: OldExpression<TIn>, private itemValue: TransformExpression<TItem, TValue>, private direction?: OldExpression<SortDirection>) {
    super(true, input, [direction]);
  }

  transform(inputValue: TIn) {
    const directionValue = this.direction != null ? this.direction.evaluate() : "asc";
    // inputValue.concat() will clone the array. Array.sort mutates the existing array, not what we want.
    return inputValue.concat().sort((item1, item2) => {
      return this.evaluateForItem(item1, this.itemValue) < this.evaluateForItem(item2, this.itemValue)
        ? (directionValue === "asc" ? -1 : 1)
        : (directionValue === "asc" ? 1 : -1);
    });
  }
}
