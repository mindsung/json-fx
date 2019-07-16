import {FxExpression} from "./model/fx-expression";
import { FxScopeVariable } from "./model/fx-scope-variable";

export class FxScope {
  public readonly owner: FxExpression;
  public parentScope: FxScope;
  public childScopes: FxScope[] = [];
  public variables: { [index: string]: FxScopeVariable };

  constructor(owner: FxExpression = null) {
    this.owner = owner;
    this.variables = {};
  }

  public getVariable(key: string): FxScopeVariable {
    if (this.variables[key]) {
      return this.variables[key];
    } else if (this.parentScope) {
      return this.parentScope.getVariable(key);
    } else {
      throw new Error(`Undefined variable "${key}"`);
    }
  }

  public setVariable(value: FxScopeVariable) {
    if (value != null) {
      value.bindScope(this);
    }
    this.variables[value.varName] = value;
  }

  public deleteAll() {
    this.variables = {};
  }

  public bind() {
    for (const key of Object.keys(this.variables)) {
      this.variables[key].bindScope(this);
    }
  }
}
