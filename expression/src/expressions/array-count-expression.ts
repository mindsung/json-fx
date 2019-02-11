import { Expression } from "../core/expression";
import { TransformExpression } from "../core/transform-expression";

export class ArrayCountExpression<TIn extends Array<any>> extends TransformExpression<TIn, number> {
  constructor(input: Expression<TIn>) {
    super(input);
  }

  transform(inputValue: TIn) {
    return inputValue.length;
  }
}
