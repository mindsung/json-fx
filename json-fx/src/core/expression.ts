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
  // TODO: What else needs to be known for token parsing?
}

export interface ScopeVariable {
  name: string;
  expr: ExpressionScope;
}

export class ExpressionScope<T = any> {
  constructor(public readonly expr: Expression<T>,
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
    return this._params || [];
  }

  public set params(params: ReadonlyArray<ExpressionScope>) {
    if (this._params) {
      this._params.forEach(p => this.removeFromScope(p));
    }
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
    return this._vars || [];
  }

  public set vars(vars: ReadonlyArray<ScopeVariable>) {
    if (this._vars) {
      this._vars.forEach(v => this.removeFromScope(v.expr));
    }
    this.varMap = {};
    if (vars != null) {
      vars.forEach(v => {
        this.addToScope(v.expr);
        this.varMap[v.name] = v.expr;
      });
    }
    this._vars = vars || [];
    this.reset();
  }

  private _vars: ReadonlyArray<ScopeVariable> = [];
  private varMap: { [key: string]: ExpressionScope };

  public addToScope(expr: ExpressionScope) {
    expr.parentScope = this;
  }

  public removeFromScope(expr: ExpressionScope) {
    if (expr.parentScope === this) {
      expr.parentScope = null;
    }
  }

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
        xInfo.params == null || xInfo.params[i] == null || !xInfo.params[i].deferEvaluation
          ? p.value : p));
      this.hasValue = true;
    }
    return this._value;
  }

  private _value: T;
  private hasValue = false;

  public reset() {
    this.vars.forEach(v => v.expr.reset());
    this.params.forEach(p => p.reset());
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
