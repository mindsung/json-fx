import { FxExpression } from "./fx-expression";

export class FxVariable extends FxExpression {
  public varName: string;

  constructor(varName: string) {
    super();
    this.varName = varName;
  }

  public evaluate() {
    return this.scope.getVariable(this.varName).evaluate();
  }

  public toString(): string {
    return this.varName;
  }
}
