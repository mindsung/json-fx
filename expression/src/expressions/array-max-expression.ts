import { Expression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";
import { TransformExpression } from "../core/transform-expression";

export class ArrayMaxExpression<TIn extends Array<TItem>, TItem, TValue extends number | string | Date> extends ArrayExpression<TIn, TItem, TValue> {
  constructor(input: Expression<TIn>, private itemValue: TransformExpression<TItem, TValue>) {
    super(input);
  }

  private maxOf(val1: TValue, val2: TValue) {
    return val1 == null && val2 == null ? null
      : val1 == null ? val2
      : val2 == null ? val1
      : val2 > val1 ? val2
      : val1;
  }

  transform(inputValue: TIn) {
    let max: TValue = null;
    inputValue.forEach(item => max = this.maxOf(max, this.evaluateForItem(item, this.itemValue)));
    return max;
  }
}
