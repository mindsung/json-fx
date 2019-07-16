import { FxExpression } from "./fx-expression";
import { FxCompileError } from "../../fx-error";

export class FxVariableReference extends FxExpression {
  public varName: string;

  constructor(varName: string) {
    super();
    this.varName = varName;
  }

  public getDependencies(): string[] {
    return super.getDependencies().concat([this.varName]);
  }

  public evaluate(): any {
    const v = this.scope.getVariable(this.varName);

    if (v == undefined) {
      throw new FxCompileError(`Undefined variable "${ this.varName }"`, this.sourceRef);
    }
    return v.evaluate();
  }

  public toString(): string {
    return this.varName;
  }
}
