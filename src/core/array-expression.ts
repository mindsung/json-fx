import { Expression, ExpressionScope } from "./expression";
import { TransformExpression } from "./transform-expression";
import { ConstantExpression } from "../expressions/constant-expression";

export abstract class ArrayExpression<TIn extends Array<TItem>, TItem, TOut> extends TransformExpression<TIn, TOut> {
  constructor(input: Expression<TIn>, scopeParams: Expression<any>[] = []) {
    super(input, scopeParams);
  }

  protected evaluateForItem<TItemOut>(item: TItem, expr: Expression<TItemOut>) {
    const scope = new ExpressionScope();
    scope.parentScope = this.scope;
    scope.setInputExpression(new ConstantExpression(item));
    scope.addExpression(expr);
    scope.wireScope();
    return expr.evaluate();
  }
}
