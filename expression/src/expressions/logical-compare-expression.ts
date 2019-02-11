import { Expression } from "../core/expression";
import { ValueType } from "../core/value-type";

export type ComparisonOperatorType = "eq" | "neq" | "gt" | "lt" | "gte" | "lte";

export class LogicalCompareExpression<TValue extends ValueType> extends Expression<boolean> {
  constructor(private params: [ Expression<TValue>, Expression<ComparisonOperatorType>, Expression<TValue> ]) {
    super(params);
  }

  private evals: { [key in ComparisonOperatorType]: (l: TValue, r: TValue) => boolean } = {
    eq: (l: TValue, r: TValue) => l === r,
    gt: (l: TValue, r: TValue) => l > r,
    lt: (l: TValue, r: TValue) => l < r,
    gte: (l: TValue, r: TValue) => l >= r,
    lte: (l: TValue, r: TValue) => l <= r,
    neq: (l: TValue, r: TValue) => l !== r
  };

  protected out() {
    return this.evals[this.params[1].evaluate()](this.params[0].evaluate(), this.params[2].evaluate());
  }
}
