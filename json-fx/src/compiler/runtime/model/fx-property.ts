import { FxExpression } from "./fx-expression";

export interface FxPropertyPathItem {
  interrupts: boolean;
  value: FxExpression;
}

export class FxProperty extends FxExpression {

  private readonly path: FxPropertyPathItem[];

  constructor(path: FxPropertyPathItem[]) {
    super();
    this.path = path;
  }

  protected get children(): FxExpression[] { return this.path.map(item => item.value); }

  evaluate(): any {
    let result = this.path[0].value.evaluate();

    if (this.path[0].interrupts && result == null) {
      return null;
    }

    for (let i = 1; i < this.path.length; i++) {
      const v = this.path[i].value.evaluate();
      result = result[v];

      if (this.path[i].interrupts && result == null) {
        return null;
      }
    }

    return result;
  }
}
