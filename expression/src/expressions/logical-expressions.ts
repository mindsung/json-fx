import { OldExpression } from "../core/expression";
import { ValueType } from "../core/value-type";
import { TransformExpression } from "../core/transform-expression";

export class LogicalEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: OldExpression<TIn>, private compareWith: OldExpression<TIn>) {
    super(false, input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue === this.compareWith.evaluate();
  }
}

export class LogicalNotEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: OldExpression<TIn>, private compareWith: OldExpression<TIn>) {
    super(false, input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue !== this.compareWith.evaluate();
  }
}

export class LogicalGreaterThanExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: OldExpression<TIn>, private compareWith: OldExpression<TIn>) {
    super(false, input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue > this.compareWith.evaluate();
  }
}

export class LogicalGreaterThanOrEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: OldExpression<TIn>, private compareWith: OldExpression<TIn>) {
    super(false, input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue >= this.compareWith.evaluate();
  }
}

export class LogicalLessThanExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: OldExpression<TIn>, private compareWith: OldExpression<TIn>) {
    super(false, input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue < this.compareWith.evaluate();
  }
}

export class LogicalLessThanOrEqualsExpression<TIn extends ValueType> extends TransformExpression<TIn, boolean> {
  constructor(input: OldExpression<TIn>, private compareWith: OldExpression<TIn>) {
    super(false, input, [compareWith]);
  }
  transform(inputValue: TIn) {
    return inputValue <= this.compareWith.evaluate();
  }
}

export class LogicalAndExpression extends TransformExpression<boolean, boolean> {
  constructor(input: OldExpression<boolean>, private other: OldExpression<true>) {
    super(false, input, [other]);
  }
  protected transform(inputValue: boolean) {
    return inputValue && this.other.evaluate();
  }
}

export class LogicalOrExpression extends TransformExpression<boolean, boolean> {
  constructor(input: OldExpression<boolean>, private other: OldExpression<true>) {
    super(false, input, [other]);
  }
  protected transform(inputValue: boolean) {
    return inputValue || this.other.evaluate();
  }
}
