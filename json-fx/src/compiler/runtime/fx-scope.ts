import {FxExpression} from "./model/fx-expression";

// const _FxScopeVariableExpressionType = "__FxScopeVariableExpression";

export class FxScopeVariableExpression {
  private readonly _inner: FxExpression;
  // private readonly _type = "a"; // _FxScopeVariableExpressionType;

  constructor(inner: FxExpression) {
    // super();
    this._inner = inner;
  }

  public evaluate(): any {
    return this._inner.evaluate();
  }
}
//
// export function isScopeVariable(expr: FxExpression): expr is FxScopeVariableExpression {
//   return expr["_type"] === "a"; // _FxScopeVariableExpressionType;
// }

export class FxScope {
  public readonly owner: FxExpression;
  public parentScope: FxScope;
  public childScopes: FxScope[] = [];
  public variables: { [index: string]: FxExpression };

  constructor(owner: FxExpression = null) {
    this.owner = owner;
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
    this.variables[key] = value; // new FxScopeVariableExpression(value);
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
