import { FxExpression } from "./fx-expression";
import { FxCompileError } from "../model/fx-error";

export class FxReference extends FxExpression {
  public varName: string;

  constructor(varName: string) {
    super();
    this.varName = varName;
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
