import { FxScope } from "../fx-scope";
import { FxExpression } from "./fx-expression";

export class FxObject extends FxExpression {
  public items: { [index: string]: FxExpression };

  constructor(items?: { [index: string]: FxExpression }) {
    super();
    this.items = items || {};
  }

  evaluate(): any {
    const result = {};
    for (const key of Object.keys(this.items)) {
      const val = this.items[key].evaluate();
      const optional = key.endsWith("?");
      if (!optional || val != null) {
        result[!optional ? key : key.substr(0, key.length - 1)] = val;
      }
    }
    return result;
  }

  bindScope(root: FxScope = null) {
    super.bindScope(root);
    for (const key of Object.keys(this.items)) {
      this.items[key].bindScope(this.scope);
    }
  }

  public toString(): string {
    const vars = Object.keys(this.scope.variables).map(key => `${key}: ${this.scope.variables[key].toString()}`);
    let items = Object.keys(this.items).map(key => `${key}: ${this.items[key].toString()}`);

    items = vars.concat(items);

    return `{${items.join(", ")}}`;
  }
}
