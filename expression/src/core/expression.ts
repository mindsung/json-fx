import { isArray, isObjectLike } from "lodash";

const EXPRESSION_CLASS_TOKEN = "_@@MINDSUNG_EXPRESSION_CLASS";

export abstract class Expression<TOut> {
  private __expression_class_token = EXPRESSION_CLASS_TOKEN;

  constructor(private createScope: boolean, scopeParams: any[] = []) {
    this.scope = new ExpressionScope(!createScope);
    this.addToScope(scopeParams);
  }

  public readonly scope: ExpressionScope;

  public addToScope(vals: any[]): Expression<TOut> {
    vals.forEach(val => {
      if (isExpression(val)) {
        this.scope.addExpression(val);
      }
      else if (isArray(val)) {
        val.forEach(v => this.addToScope(v));
      }
      else if (isObjectLike(val)) {
        this.addToScope(Object.keys(val).map(k => val[k]));
      }
    });
    return this;
  }

  protected abstract out(): TOut;

  public evaluate() {
    this.scope.wireScope();
    return this.out();
  }
}

export function isExpression(value: any): value is Expression<any> {
  return value != null && value["__expression_class_token"] === EXPRESSION_CLASS_TOKEN;
}

class ExpressionValueCache<TOut> extends Expression<TOut> {
  constructor(public expr: Expression<TOut>) {
    super(false);
  }

  private cachedValue: TOut;
  private isEvaluated = false;

  protected out(): TOut {
    throw new Error("Expression value cache should never call output.");
  }

  public evaluate() {
    if (!this.isEvaluated) {
      this.cachedValue = this.expr.evaluate();
      this.isEvaluated = true;
    }
    return this.cachedValue;
  }

  public uncache() {
    this.isEvaluated = false;
    this.cachedValue = undefined;
  }
}

export class ExpressionScope {
  constructor(private proxyParent: boolean) {}

  public parentScope: ExpressionScope = null;
  private expressions: ExpressionValueCache<any>[] = [];
  private variables: { [ key: string ]: ExpressionValueCache<any> } = {};

  public setInputExpression(input: Expression<any>) {
    this.inputCache = input != null ? new ExpressionValueCache(input) : null;
  }
  private inputCache: ExpressionValueCache<any>;

  public addExpression(expr: Expression<any>) {
    const exprCache = new ExpressionValueCache(expr);
    this.expressions.push(exprCache);
    return exprCache;
  }

  public addVariableExpression(name: string, expr: Expression<any>) {
    if (this.proxyParent) {
      throw new Error("Variables may only be added to scoped expressions.");
    }
    if (!name || !name.startsWith("$")) {
      throw new Error(`Invalid expression variable name "${name}": variable names must begin with "$".`);
    }
    const exprCache = this.addExpression(expr);
    this.variables[name] = exprCache;
    return exprCache;
  }

  public addVariableAlias(name: string, refName: string) {
    const ref = this.getVariable(refName);
    if (ref == null) {
      throw new Error(`Can't add variable alias "${name}", expression variable "${refName}" was not found in scope.`);
    }
    this.variables[name] = ref;
  }

  private traverseScopeForVariable(name: string, occurrence: number): ExpressionValueCache<any> {
    const ref = name === "$" ? (this.inputCache != null ? this.inputCache : null) : this.variables[name];
    return ref != null
      ? occurrence <= 1
        ? ref
        : this.parentScope != null
          ? this.parentScope.traverseScopeForVariable(name, occurrence - 1)
          : null
      : this.parentScope != null ? this.parentScope.traverseScopeForVariable(name, occurrence)
      : null;
  }

  public static isInputVariableName(name: string) {
    return [].every.call(name, (c: string) => c === "$");
  }

  private getVariable(name: string): ExpressionValueCache<any> {
    if (ExpressionScope.isInputVariableName(name)) {
      return this.traverseScopeForVariable("$", name.length);
    }
    else {
      return this.traverseScopeForVariable(name, 1);
    }
  }

  public evaluateVariable(name: string): any {
    const exprCache = this.getVariable(name);
    if (exprCache == null) {
      throw new Error(`Expression variable "${name}" was not found in scope.`);
    }
    return exprCache.evaluate();
  }

  public wireScope() {
    if (this.inputCache != null) {
      this.inputCache.expr.scope.parentScope = this.parentScope;
      this.inputCache.uncache();
    }
    this.expressions.forEach(exprCache => {
      exprCache.expr.scope.parentScope = this.proxyParent ? this.parentScope : this;
      exprCache.uncache();
    });
  }
}
