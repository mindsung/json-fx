import { FxExpression } from "./fx-expression";

export class FxVariableReference extends FxExpression {
  public varName: string;

  constructor(varName: string) {
    super();
    this.varName = varName;
  }

  public evaluate(): any {
    return this.scope.getVariable(this.varName)
      .evaluate();
  }

  public toString(): string {
    return this.varName;
  }
}
