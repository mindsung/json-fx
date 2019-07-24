import { FxExpression } from "./fx-expression";
import { FxLambda } from "./fx-lambda";
import { isArray, isObject } from "../common";
import { FxField, FxKeyValue } from "../model/fx-field";

export class FxDynamicField extends FxField {

  public readonly expression: FxExpression;
  public readonly lambda: FxLambda;

  constructor(expression: FxExpression, lambda: FxLambda) {
    super();
    this.expression = expression;
    this.lambda = lambda;
  }

  protected get children(): FxExpression[] { return [this.expression, this.lambda]; }

  public evaluate(): FxKeyValue[] {
    const value = this.expression.evaluate();

    if (isObject(value)) {
      return Object.keys(value).map(key => ({ key: key, value: this.lambda.evaluator(key, value[key]) }));
    } else if (isArray(value)) {
      return value.map(item => ({ key: item.toString(), value: this.lambda.evaluator(item) }));
    } else {
      return [{ key: value.toString(), value: this.lambda.evaluator(value) }];
    }
  }
}
