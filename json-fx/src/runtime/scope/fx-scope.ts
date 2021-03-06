import { FxScopeVariable } from "./fx-scope-variable";
import { FxExpression } from "../fx-expression";

export class FxScope {
  public readonly owner: FxExpression;
  public parentScope: FxScope;
  public variables: { [index: string]: FxScopeVariable };

  constructor(owner: FxExpression = null) {
    this.owner = owner;
    this.variables = {};
  }

  public getVariable(key: string): FxScopeVariable {
    const dependents: FxScopeVariable[] = [];
    let scope: FxScope = this;
    while (scope != null) {
      if (isScopeVariable(scope.owner)) {
        dependents.push(scope.owner);
      }
      const v = scope.variables[key];
      if (v != null) {
        v.addDependents(dependents);
        return v;
      }
      scope = scope.parentScope;
    }
    return undefined;
  }

  public setVariable(value: FxScopeVariable): void {
    if (value == null) {
      throw new Error("Cannot set null variable.");
    }
    const currentVar = this.variables[value.varName];
    if (currentVar != null) {
      currentVar.clearCache();
    }
    value.bindScope(this);
    this.variables[value.varName] = value;
  }

  public clearVariables(): void {
    for (const k of Object.keys(this.variables)) {
      this.variables[k].clearCache();
    }
    this.variables = {};
  }

  public bind(): void {
    for (const key of Object.keys(this.variables)) {
      this.variables[key].bindScope(this);
    }
  }
}

export function isScopeVariable(expr: FxExpression): expr is FxScopeVariable {
  return expr == null ? false : expr["_fxScopeVariableExpressionType"] === "__FxScopeVariableExpression";
}
