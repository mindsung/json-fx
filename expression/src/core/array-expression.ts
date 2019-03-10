import { OldExpression, OldExpressionScope } from "./expression";
import { TransformExpression } from "./transform-expression";
import { ConstantExpression } from "../expressions/constant-expression";
import { PropertyExpression } from "../expressions/property-expression";

export abstract class ArrayExpression<TIn extends Array<TItem>, TItem, TOut> extends TransformExpression<TIn, TOut> {
  constructor(createScope: boolean, input: OldExpression<TIn>, scopeParams: OldExpression<any>[] = []) {
    super(createScope, input, scopeParams);
  }

  protected evaluateForItem<TItemOut>(item: TItem, expr: OldExpression<TItemOut>) {
    const scope = new OldExpressionScope(false);
    scope.parentScope = this.scope;
    scope.setInputExpression(new ConstantExpression(item));
    scope.addExpression(expr);
    scope.wireScope();
    return expr.evaluate();
  }
}
