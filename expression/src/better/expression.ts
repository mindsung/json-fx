export interface Expression {
  readonly key: string;
  readonly expression?: (...params: any[]) => any;
  readonly expressionFactory?: (scope: ExpressionScope) => (...params: any[]) => any;
  readonly params?: ReadonlyArray<ExpressionParam>;
  readonly token?: ExpressionToken;
  readonly isOverride?: boolean;
}

interface ExpressionParam {
  readonly name: string;
  readonly description?: string;
  readonly valueType?: "string" | "number" | "boolean" | "date" | "object" | "array";
  readonly requireExpression?: boolean;
}

interface ExpressionToken {
  readonly key: string;
  // TODO: What else needs to be known for token parsing?
}

export interface ScopeVariable {
  name: string;
  scope: ExpressionScope;
}

export class ExpressionScope {
  constructor(public readonly expr: Expression,
              params?: ReadonlyArray<ExpressionScope>,
              vars?: ReadonlyArray<ScopeVariable>) {
    if (expr == null) {
      throw new Error("Expression scope requires expression info.");
    }
    if (expr.expression == null && expr.expressionFactory == null) {
      throw new Error("Expression scope requires either an expression or an expression factory.");
    }

    this.params = params;
    this.vars = vars;
  }

  public get params() {
    return this._params;
  }

  public set params(params: ReadonlyArray<ExpressionScope>) {
    if (params != null) {
      params.forEach(p => {
        this.addToScope(p);
      });
    }
    this._params = params || [];
    this.reset();
  }

  private _params: ReadonlyArray<ExpressionScope>;

  public get vars() {
    return this._vars;
  }

  public set vars(vars: ReadonlyArray<ScopeVariable>) {
    this.varMap = {};
    if (vars != null) {
      vars.forEach(v => {
        this.addToScope(v.scope);
        this.varMap[v.name] = v.scope;
      });
    }
    this._vars = vars || [];
    this.reset();
  }

  private _vars: ReadonlyArray<ScopeVariable> = [];
  private varMap: { [key: string]: ExpressionScope };

  public addToScope(scope: ExpressionScope) {
    scope.parentScope = this;
  }

  private parentScope: ExpressionScope;

  private expression: (...params: any[]) => any;

  public get value(): any {
    if (!this.hasValue) {
      const xInfo = this.expr;
      if (this.expression == null) {
        this.expression = xInfo.expression ? xInfo.expression
          : xInfo.expressionFactory(this);
      }
      this._value = this.expression(...(this.params || []).map((p, i) =>
        xInfo.params != null && xInfo.params[i] != null && xInfo.params[i].requireExpression
          ? p : p.value));
      this.hasValue = true;
    }
    return this._value;
  }

  private _value: any;
  private hasValue = false;

  public reset() {
    this.vars.forEach(v => v.scope.reset());
    this.params.forEach(p => p.reset());
    this.hasValue = false;
    this._value = undefined;
  }

  public getVariableExpression(name: string): ExpressionScope {
    const scopeVar = this.varMap[name];
    if (scopeVar != null) {
      return scopeVar;
    }
    if (this.parentScope != null) {
      return this.parentScope.getVariableExpression(name);
    }
    throw new Error(`Expression variable "${name}" was not found in scope.`);
  }

  public getVariableValue(name: string, params?: ExpressionScope[]): any {
    const scopeVar = this.getVariableExpression(name);
    if (params != null && params.length > 0) {
      if (scopeVar.expr.key !== "__lambda") {
        throw new Error(`Invalid variable "${name}" was called as an expression. Only variable expressions may be called with parameters.`);
      }
      scopeVar.params = params;
    }
    return scopeVar.value;
  }
}
