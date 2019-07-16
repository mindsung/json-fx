import { FxScope } from "../fx-scope";
import { SourceRef } from "../source-ref";

export abstract class FxExpression {
  private readonly _scope: FxScope;

  public sourceRef: SourceRef;

  protected constructor() {
    this._scope = new FxScope();
    this.sourceRef = { symbol: "", index: -1, path: "" };
  }

  protected get children(): FxExpression[] { return []; }

  public get scope(): FxScope { return this._scope; }

  public evaluate(): any {}

  public bindSourceRefPath(): void {
    for (const child of this.children) {
      child.sourceRef.path = this.sourceRef.path;
    }
  }

  public bindScope(parent: FxScope = null): void {
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

    for (const child of this.children) {
      child.bindScope(this.scope);
    }
  }

  public toString(): string {
    return this.constructor.name;
  }
}

