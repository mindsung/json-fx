import { OldExpression } from "./expression";

const TRANSFORM_EXPRESSION_CLASS_TOKEN = "_@@MINDSUNG_TRANSFORM_EXPRESSION_CLASS";

export abstract class TransformExpression<TIn, TOut> extends OldExpression<TOut> {
  private __transform_expression_class_token = TRANSFORM_EXPRESSION_CLASS_TOKEN;

  constructor(createScope: boolean, input: OldExpression<TIn>, scopeParams: OldExpression<any>[] = []) {
    super(createScope, scopeParams);
    this.scope.setInputExpression(input);
  }

  protected abstract transform(source: TIn): TOut;

  protected out(): TOut {
    return this.transform(this.scope.evaluateVariable("$"));
  }
}

export function isTransformExpression(value: any): value is TransformExpression<any, any> {
  return value != null && value["__transform_expression_class_token"] === TRANSFORM_EXPRESSION_CLASS_TOKEN;
}
