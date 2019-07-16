import { FxExpression } from "./fx-expression";
import { FxScope } from "../fx-scope";

export class FxScopeVariable extends FxExpression {
  private readonly _fxScopeVariableExpressionType = "__FxScopeVariableExpression";
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
        this.cachedValue = this.inner.evaluate();
        this.isCached = true;
      }
      return this.cachedValue;
    }
    else {
      return this.inner.evaluate();
    }
  }

  clearCache(): void {
    this.isCached = false;
    this.cachedValue = undefined;
    for (const d of this.dependents) {
      d.clearCache();
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
      }
    }
  }
}
