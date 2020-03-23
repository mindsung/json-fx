import { FxExpression } from "./fx-expression";

export class FxConstant extends FxExpression {
  public value: any;

  constructor(value: any = null) {
    super();
    this.value = value;
  }

  public replaceValue(value: any) {
    this.value = value;
  }

  public evaluate() {
    return this.value;
  }

  public toString(): string {
    return this.value == null ? "(null)" : this.value.toString();
  }
}
