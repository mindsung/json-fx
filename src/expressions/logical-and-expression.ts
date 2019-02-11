import { Expression } from "../core/expression";

export class LogicalAndExpression extends Expression<boolean> {
  constructor(private params: Expression<true>[]) {
    super(params);
  }

  protected out() {
    return this.params.every(cond => cond.evaluate() === true);
  }
}
