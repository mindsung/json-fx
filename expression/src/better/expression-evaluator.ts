import {Expression, ExpressionScope, ScopeVariable} from "./expression";

export class ExpressionEvaluator {
  constructor(public readonly expressionInfo: Expression,
              public readonly params?: ReadonlyArray<ExpressionScope>) {
    this.scope = new ExpressionScope(expressionInfo, params);
  }

  private scope: ExpressionScope;

  public evaluate(inputVars: ReadonlyArray<ScopeVariable>) {
    this.scope.vars = inputVars;
    return this.scope.value;
  }
}
