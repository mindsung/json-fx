export interface Expression<T = any> {
  readonly key: string;
  readonly expression?: (...params: any[]) => T;
  readonly expressionFactory?: (scope: ExpressionScope) => (...params: any[]) => T;
  readonly params?: ReadonlyArray<ExpressionParam>;
  readonly token?: ExpressionToken;
  readonly isOverride?: boolean;
}

interface ExpressionParam {
  readonly name: string;
  readonly description?: string;
  readonly valueType?: "string" | "number" | "boolean" | "date" | "object" | "array";
  readonly deferEvaluation?: boolean;
}

interface ExpressionToken {
  readonly key: string;
  readonly precedence: number;
  readonly assoc?: "left" | "right";
  readonly operandOn?: "left" | "right" | "both";
  // TODO: What else needs to be known for token parsing?
}

export interface ScopeVariable {
  name: string;
  expr: ExpressionScope;
}

export class ExpressionScope<T = any> {
  constructor(public readonly expr: Expression<T>) {
    if (expr == null) {
      throw new Error("Expression scope requires expression info.");
    }
    if (expr.expression == null && expr.expressionFactory == null) {
      throw new Error("Expression scope requires either an expression or an expression factory.");
    }
  }

  public get params() {
    return this._params;
  }

  public set params(params: ExpressionScope[]) {
    if (this._params.length === this.scopeExprs.length) {
      this.clearScope();
    }
    else {
      this._params.forEach(p => this.removeFromScope(p));
      this._params = [];
    }
    this.withParams(params);
  }

  public withParams(params: ExpressionScope[]) {
    if (params != null && params.length > 0) {
      params.forEach(p => {
        this.addToScope(p);
      });
      this._params.push(...params);
      this.reset();
    }
    return this;
  }

  private _params: ExpressionScope[] = [];

  public get vars() {
    return Object.keys(this.varMap).map(v => ({ name: v, expr: this.varMap[v] }));
  }

  public set vars(vars: ScopeVariable[]) {
    if (Object.keys(this.varMap).length === this.scopeExprs.length) {
      this.clearScope();
    }
    else {
      Object.keys(this.varMap).forEach(v => this.removeFromScope(this.varMap[v]));
      this.varMap = {};
    }
    this.withVars(vars);
  }

  public withVars(vars: ScopeVariable[]) {
    if (vars != null && vars.length > 0) {
      vars.forEach(v => {
        const found = this.varMap[v.name];
        if (found) { this.removeFromScope(found); }
        this.addToScope(v.expr);
        this.varMap[v.name] = v.expr;
      });
      this.reset();
    }
    return this;
  }

  private varMap: { [key: string]: ExpressionScope } = {};

  public addToScope(...expr: ExpressionScope[]) {
    expr.forEach(x => {
      if (this.scopeExprs.indexOf(x) < 0) {
        x.parentScope = this;
        this.scopeExprs.push(x);
      }
    });
  }

  public removeFromScope(...expr: ExpressionScope[]) {
    expr.forEach(x => {
      if (x.parentScope === this) {
        x.parentScope = null;
        const i = this.scopeExprs.indexOf(x);
        if (i >= 0) {
          this.scopeExprs.splice(i, 1);
        }
      }
    });
  }

  private clearScope() {
    this.scopeExprs.forEach(x => x.parentScope = null);
    this.scopeExprs = [];
    this.varMap = {};
    this._params = [];
    this.reset();
  }

  public withScopeExprs(exprs: ExpressionScope[]) {
    this.addToScope(...exprs);
    return this;
  }

  private scopeExprs: ExpressionScope[] = [];

  private parentScope: ExpressionScope;

  private expression: (...params: any[]) => any;

  public get value(): T {
    if (!this.hasValue) {
      const xInfo = this.expr;
      if (this.expression == null) {
        this.expression = xInfo.expression ? xInfo.expression
          : xInfo.expressionFactory(this);
      }
      this._value = this.expression(...(this.params || []).map((p, i) =>
        p == null ? undefined
          : xInfo.params == null || xInfo.params[i] == null || !xInfo.params[i].deferEvaluation
          ? p.value : p));
      this.hasValue = true;
    }
    return this._value;
  }

  private _value: T;
  private hasValue = false;

  public reset() {
    this.scopeExprs.forEach(x => x.reset());
    this.hasValue = false;
    this._value = undefined;
  }

  public getVariableExpression(name: string): ExpressionScope {
    const varExpr = this.varMap[name];
    if (varExpr != null) {
      return varExpr;
    }
    if (this.parentScope != null) {
      return this.parentScope.getVariableExpression(name);
    }
    throw new Error(`Expression variable "${name}" was not found in scope.`);
  }

  public getVariableValue(name: string, params?: ExpressionScope[]): any {
    const varExpr = this.getVariableExpression(name);
    if (params != null && params.length > 0) {
      if (varExpr.expr.key !== "*_lambda") {
        throw new Error(`Invalid variable "${name}" was called as an expression. Only variable expressions may be called with parameters.`);
      }
      varExpr.params = params;
    }
    return varExpr.value;
  }
}
