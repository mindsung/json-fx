import { Expression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";

export class ArrayFilterExpression<TIn extends Array<TItem>, TItem> extends ArrayExpression<TIn, TItem, Array<TItem>> {
  constructor(input: Expression<TIn>, private condition: Expression<boolean>) {
    super(input);
  }

  transform(inputValue: TIn) {
    return inputValue.filter(item => this.evaluateForItem(item, this.condition) === true);
  }
}
