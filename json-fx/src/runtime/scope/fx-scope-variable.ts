import { FxExpression } from "../fx-expression";
import { FxScope } from "./fx-scope";
import { FxConstant } from "../fx-constant";

export class FxScopeVariable extends FxExpression {
  private readonly _fxScopeVariableExpressionType = "__FxScopeVariableExpression";
  public readonly varName: string;
  protected readonly inner: FxExpression;
  protected readonly canCache: boolean;
  protected readonly dependents: FxScopeVariable[] = [];
  protected cachedValue: any;
  protected isCached = false;

  constructor(name: string, inner: FxExpression, canCache = true) {
    super();
    this.varName = name;
    this.inner = inner;
    this.canCache = canCache;
  }

  evaluate(): any {
    if (this.inner == null) {
      return null;
    } else if (this.canCache) {
      if (!this.isCached) {
        this.cachedValue = this.inner.evaluate();
        this.isCached = true;
      }
      return this.cachedValue;
    } else {
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

  bindScope(root: FxScope = null): void {
    super.bindScope(root);
    if (this.inner != null) {
      this.inner.bindScope(this.scope);
    }
  }

  addDependents(dependents: FxScopeVariable[]): void {
    for (const dep of dependents) {
      if (this.dependents.indexOf(dep) < 0) {
        this.dependents.push(dep);
      }
    }
  }
}

export class FxConstantVariable extends FxScopeVariable {
  constructor(name: string, private value: any) {
    super(name, new FxConstant(value), true);
    this.constant = this.inner as FxConstant;
  }

  private constant: FxConstant;

  replaceValue(value: any) {
    this.constant.replaceValue(value);
    this.clearCache();
  }
}
