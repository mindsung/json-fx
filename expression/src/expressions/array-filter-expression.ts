import { OldExpression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";

export class ArrayFilterExpression<TIn extends Array<TItem>, TItem> extends ArrayExpression<TIn, TItem, Array<TItem>> {
  constructor(input: OldExpression<TIn>, private condition: OldExpression<boolean>) {
    super(true, input);
  }

  transform(inputValue: TIn) {
    return inputValue.filter(item => this.evaluateForItem(item, this.condition) === true);
  }
}
