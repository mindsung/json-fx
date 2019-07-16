import { FxExpression } from "./fx-expression";
import { FxCompileError } from "../../fx-error";

export class FxVariable extends FxExpression {
  public varName: string;

  constructor(varName: string) {
    super();
    this.varName = varName;
  }

  public evaluate(): any {
    const variable = this.scope.getVariable(this.varName);

    if (variable == undefined) {
      throw new FxCompileError(`Undefined variable "${ this.varName }"`, this.sourceRef);
    }
    return this.scope.getVariable(this.varName)
      .evaluate();
  }

  public toString(): string {
    return this.varName;
  }
}
