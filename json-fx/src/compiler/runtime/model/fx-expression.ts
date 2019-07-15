import { FxScope } from "../fx-scope";
import { SourceRef } from "../source-ref";

export abstract class FxExpression {
  private readonly _scope: FxScope;

  public sourceRef: SourceRef;

  protected constructor() {
    this._scope = new FxScope();
  }

  public get scope() {
    return this._scope;
  }

  evaluate(): any {
  }

  public bindScope(parent: FxScope = null) {
    if (this.scope.parentScope !== parent) {
      if (this.scope.parentScope != null) {
        const i = this.scope.parentScope.childScopes.indexOf(this.scope);
        if (i >= 0) {
          this.scope.parentScope.childScopes.splice(i, 1);
        }
      }
      parent.childScopes.push(this.scope);
      this.scope.parentScope = parent;
      this.scope.bind();
    }
  }

  public toString(): string {
    return "<unknown>";
  }
}

