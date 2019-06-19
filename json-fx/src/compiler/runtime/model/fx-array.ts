import { FxExpression } from "./fx-expression";
import { FxScope } from "../fx-scope";

export class FxArray extends FxExpression {
  public items: FxExpression[];

  constructor(items?: FxExpression[]) {
    super();
    this.items = items || [];
  }

  evaluate() {
    return this.items.map(item => item.evaluate());
  }

  public bindScope(root: FxScope = null) {
    super.bindScope(root);
    this.items.forEach(item => item.bindScope(this.scope));
  }

  public toString(): string {
    return `[${this.items.map(item => item.toString())}]`;
  }
}
