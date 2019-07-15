import {FxExpression} from "./model/fx-expression";


export class FxScope {
  public parentScope: FxScope;
  public childScopes: FxScope[] = [];
  public variables: { [index: string]: FxExpression };

  constructor() {
    this.variables = {};
  }

  public getVariable(key: string) {
    if (this.variables[key]) {
      return this.variables[key];
    } else if (this.parentScope) {
      return this.parentScope.getVariable(key);
    } else {
      throw new Error(`Undefined variable "${key}"`);
    }
  }

  public setVariable(key: string, value: FxExpression) {
    if (value != null) {
      value.bindScope(this);
    }
    this.variables[key] = value;
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
