import { OldExpression } from "../core/expression";

export class VariableExpression<TOut> extends OldExpression<TOut> {
  constructor(private name: string) {
    super(false);
  }

  protected out() {
    return this.scope.evaluateVariable(this.name);
  }
}
