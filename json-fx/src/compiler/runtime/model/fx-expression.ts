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

  public bindScope(root: FxScope = null) {
    this.scope.owner = root;
    this.scope.bind();
  }

  public toString(): string {
    return "<unknown>";
  }
}

