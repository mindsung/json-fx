import { FxExpression } from "./fx-expression";
import { isScopeVariable } from "./fx-scope-variable";
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
    const variable = this.scope.getVariable(this.varName);

    if (variable == undefined) {
      throw new FxCompileError(`Undefined variable "${ this.varName }"`, this.sourceRef);
    }
    return this.scope.getVariable(this.varName)
    .evaluate();
  }

  resolveDependencies(): any {
    super.resolveDependencies();
    let parentScope = this.scope.parentScope;
    while (parentScope != null) {
      if (isScopeVariable(parentScope.owner)) {
        // console.log(`defer ${parentScope.owner.varName} depends on ${this.varName}`);
      }
      parentScope = parentScope.parentScope;
    }
  }

  public toString(): string {
    return this.varName;
  }
}
