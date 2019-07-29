import { FxExpression } from "./fx-expression";
import { FxField, FxKeyValue } from "../model/fx-field";

export class FxStaticField extends FxField {

  public readonly key: string;
  public readonly value: FxExpression;

  constructor(key: string, value: FxExpression) {
    super();
    this.key = key;
    this.value = value;
  }

  protected get children(): FxExpression[] { return [this.value]; }

  public evaluate(): FxKeyValue[] {
    return [{ key: this.key, value: this.value.evaluate() }];
  }
}
