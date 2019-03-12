import { OldExpression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";
import { TransformExpression } from "../core/transform-expression";

export class ArrayAvgExpression<TIn extends Array<TItem>, TItem> extends ArrayExpression<TIn, TItem, number> {
  constructor(input: OldExpression<TIn>, private itemValue: TransformExpression<TItem, number>) {
    super(true, input);
  }

  transform(inputValue: TIn) {
    let count = 0;
    let total = 0;
    inputValue.forEach(item => {
      const val = this.evaluateForItem(item, this.itemValue);
      if (val != null) {
        count++;
        total += val;
      }
    });
    return count > 0 ? total / count : null;
  }
}
