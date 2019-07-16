import { FxExpression } from "./fx-expression";
import { FxScope } from "../fx-scope";

const _FxScopeVariableExpressionType = "__FxScopeVariableExpression";

export class FxScopeVariable extends FxExpression {
  private readonly _fxScopeVariableExpressionType = _FxScopeVariableExpressionType;
  public readonly varName: string;
  private readonly inner: FxExpression;
  private readonly canCache: boolean;
  private readonly dependents: FxScopeVariable[] = [];
  private cachedValue: any;
  private isCached = false;

  constructor(name: string, inner: FxExpression, canCache = true) {
    super();
    this.varName = name;
    this.inner = inner;
    this.canCache = canCache;
  }

  public evaluate(): any {
    if (this.inner == null) {
      return null;
    }
    else if (this.canCache) {
      if (!this.isCached) {
        // console.log("eval and cache", this.varName);
        this.cachedValue = this.inner.evaluate();
        this.isCached = true;
      }
      return this.cachedValue;
    }
    else {
      // console.log("eval", this.varName);
      return this.inner.evaluate();
    }
  }

  bindScope(root: FxScope = null) {
    super.bindScope(root);
    if (this.inner != null) {
      this.inner.bindScope(this.scope);
    }
  }

  addDependents(dependents: FxScopeVariable[]) {
    for (const dep of dependents) {
      if (this.dependents.indexOf(dep) < 0) {
        this.dependents.push(dep);
        // console.log(`${dep.varName} has dependency ${this.varName}`);
      }
    }
  }
}

export function isScopeVariable(expr: FxExpression): expr is FxScopeVariable {
  return expr["_fxScopeVariableExpressionType"] === _FxScopeVariableExpressionType;
}
