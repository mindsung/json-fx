import { FxExpression } from "./fx-expression";
import { isEmpty, isObject } from "../../common";
import { FxCompileError } from "../../fx-error";

export class FxObject extends FxExpression {
  public items: { [index: string]: FxExpression };
  public output: FxExpression;

  constructor(items?: { [index: string]: FxExpression }) {
    super();
    this.items = items || {};
  }

  protected get children(): FxExpression[] {
    const children = Object.keys(this.items).map(key => this.items[key]);

    if (this.output) {
      children.push(this.output);
    }

    return children;
  }

  evaluate(): any {
    if (this.output) {
      if (Object.keys(this.items).length > 0) {
        throw new FxCompileError("Object with yield key \"()\" may only define variable and template keys", this.sourceRef);
      }
      return this.output.evaluate();
    }

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

  public toString(): string {
    const vars = Object.keys(this.scope.variables).map(key => `${ key }: ${ this.scope.variables[key].toString() }`);
    let items = Object.keys(this.items).map(key => `${ key }: ${ this.items[key].toString() }`);

    items = vars.concat(items);

    return `{${ items.join(", ") }}`;
  }
}
