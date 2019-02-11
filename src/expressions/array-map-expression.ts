import { Expression } from "../core/expression";
import { ArrayExpression } from "../core/array-expression";
import { TransformExpression } from "../core/transform-expression";

export class ArrayMapExpression<TIn extends Array<TItem>, TItem, TItemOut> extends ArrayExpression<TIn, TItem, Array<TItemOut>> {
  constructor(input: Expression<TIn>, private params: [ TransformExpression<TItem, TItemOut> ]) {
    super(input);
  }

  transform(inputValue: TIn) {
    return inputValue.map(item => this.evaluateForItem(item, this.params[0]));
  }
}
