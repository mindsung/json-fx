import { OldExpression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";
import { TransformExpression } from "../core/transform-expression";

export class ArrayMinExpression<TIn extends Array<TItem>, TItem, TValue extends number | string | Date> extends ArrayExpression<TIn, TItem, TValue> {
  constructor(input: OldExpression<TIn>, private itemValue: TransformExpression<TItem, TValue>) {
    super(true, input);
  }

  private minOf(val1: TValue, val2: TValue) {
    return val1 == null && val2 == null ? null
      : val1 == null ? val2
      : val2 == null ? val1
      : val2 < val1 ? val2
      : val1;
  }

  transform(inputValue: TIn) {
    let min: TValue = null;
    inputValue.forEach(item => min = this.minOf(min, this.evaluateForItem(item, this.itemValue)));
    return min;
  }
}
