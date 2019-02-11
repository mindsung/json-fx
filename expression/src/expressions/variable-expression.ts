import { Expression } from "../core/expression";

export class VariableExpression<TOut> extends Expression<TOut> {
  constructor(private name: string) {
    super();
  }

  protected out() {
    return this.scope.evaluateVariable(this.name);
  }
}
