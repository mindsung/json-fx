import { OldExpression, isExpression } from "../core/expression";

export class ConstantExpression<TOut> extends OldExpression<TOut> {
  constructor(private value: TOut) {
    super(false);
    if (isExpression(value)) {
      throw new Error("Constant expression cannot return an expression.");
    }
  }

  protected out() {
    return this.value;
  }
}
