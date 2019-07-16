import { FxExpression } from "./fx-expression";
import { FxScopeVariable, isScopeVariable } from "./fx-scope-variable";

export class FxVariableReference extends FxExpression {
  public varName: string;
  private resolved: FxScopeVariable;
  private dependencies: FxScopeVariable[] = [];

  constructor(varName: string) {
    super();
    this.varName = varName;
  }

  private getResolved(): FxScopeVariable {
    if (this.resolved == null) {
      this.resolved = this.scope.getVariable(this.varName);
      this.resolved.addDependents(this.dependencies);
    }
    return this.resolved;
  }

  public evaluate(): any {
    return this.getResolved().evaluate();
  }

  resolveDependencies(): any {
    super.resolveDependencies();
    let parentScope = this.scope.parentScope;
    while (parentScope != null) {
      if (isScopeVariable(parentScope.owner)) {
        // console.log(`defer ${parentScope.owner.varName} depends on ${this.varName}`);
        this.dependencies.push(parentScope.owner);
      }
      parentScope = parentScope.parentScope;
    }
  }

  public toString(): string {
    return this.varName;
  }
}
