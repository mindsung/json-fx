import { FxExpression } from "../runtime/fx-expression";

export abstract class FxField extends FxExpression {
  public abstract evaluate(): FxKeyValue[];
}

export interface FxKeyValue {
  key: string;
  value: any;
}
