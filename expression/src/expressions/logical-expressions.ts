import { Expression } from "../core/expression";
import { ValueType } from "../core/value-type";
import { TransformExpression } from "../core/transform-expression";

export class LogicalEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: Expression<TIn>, private compareWith: Expression<TIn>) {
    super(input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue === this.compareWith.evaluate();
  }
}

export class LogicalNotEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: Expression<TIn>, private compareWith: Expression<TIn>) {
    super(input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue !== this.compareWith.evaluate();
  }
}

export class LogicalGreaterThanExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: Expression<TIn>, private compareWith: Expression<TIn>) {
    super(input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue > this.compareWith.evaluate();
  }
}

export class LogicalGreaterThanOrEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: Expression<TIn>, private compareWith: Expression<TIn>) {
    super(input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue >= this.compareWith.evaluate();
  }
}

export class LogicalLessThanExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: Expression<TIn>, private compareWith: Expression<TIn>) {
    super(input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue < this.compareWith.evaluate();
  }
}

export class LogicalLessThanOrEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: Expression<TIn>, private compareWith: Expression<TIn>) {
    super(input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue <= this.compareWith.evaluate();
  }
}

export class LogicalAndExpression extends TransformExpression<boolean, boolean> {
  constructor(input: Expression<boolean>, private other: Expression<true>) {
    super(input, [other]);
  }
  protected transform(inputValue: boolean) {
    return inputValue && this.other.evaluate();
  }
}

export class LogicalOrExpression extends TransformExpression<boolean, boolean> {
  constructor(input: Expression<boolean>, private other: Expression<true>) {
    super(input, [other]);
  }
  protected transform(inputValue: boolean) {
    return inputValue || this.other.evaluate();
  }
}
