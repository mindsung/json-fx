import { Expression } from "../core/expression";

export class LogicalOrExpression extends Expression<boolean> {
  constructor(private params: Expression<true>[]) {
    super(params);
  }

  protected out() {
    return this.params.some(cond => cond.evaluate() === true);
  }
}
