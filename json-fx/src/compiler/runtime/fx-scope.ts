import { FxExpression } from "./model/fx-expression";


export class FxScope {
  public owner: FxScope;
  public variables: { [index: string]: FxExpression };

  constructor(owner: FxScope = null) {
    this.owner = owner;
    this.variables = {};
  }

  public getVariable(key: string) {
    if (this.variables[key]) {
      return this.variables[key];
    } else if (this.owner) {
      return this.owner.getVariable(key);
    } else {
      throw new Error(`Undefined variable "${key}"`);
    }
  }

  public setVariable(key: string, value: FxExpression) {
    this.variables[key] = value;
  }

  public bind() {
    for (const key of Object.keys(this.variables)) {
      this.variables[key].bindScope(this);
    }
  }

  public clearAll() {
    this.variables = {};
  }
}
