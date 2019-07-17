import { FxExpression } from "./fx-expression";
import { isEmpty, isObject } from "../../common";

export class FxObject extends FxExpression {
  public items: { [index: string]: FxExpression };

  constructor(items?: { [index: string]: FxExpression }) {
    super();
    this.items = items || {};
  }

  protected get children(): FxExpression[] { return Object.keys(this.items).map(key => this.items[key]); }

  evaluate(): any {
    const result = {};
    for (const key of Object.keys(this.items)) {
      const value = this.items[key].evaluate();
      const optional = key.endsWith("?");
      if (!optional || !(value == null || (isObject(value) && isEmpty(value)))) {
        result[!optional ? key : key.substr(0, key.length - 1)] = value;
      }
    }
    return result;
  }

  bindSourceRefPath(): void {
    super.bindSourceRefPath();
    const useDot = !!this.sourceRef.path;

    for (const key of Object.keys(this.items)) {
      this.items[key].sourceRef.path += useDot ? "." + key : key;
      this.items[key].bindSourceRefPath();
    }
  }

  public toString(): string {
    const vars = Object.keys(this.scope.variables).map(key => `${ key }: ${ this.scope.variables[key].toString() }`);
    let items = Object.keys(this.items).map(key => `${ key }: ${ this.items[key].toString() }`);

    items = vars.concat(items);

    return `{${ items.join(", ") }}`;
  }
}
