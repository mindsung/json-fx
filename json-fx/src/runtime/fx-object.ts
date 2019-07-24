import { FxExpression } from "./fx-expression";
import { isEmpty, isObject } from "../common";
import { FxCompileError } from "../model/fx-error";
import { FxStaticField } from "./fx-static-field";
import { FxDynamicField } from "./fx-dynamic-field";
import { FxField } from "../model/fx-field";
import { FxConstant } from "./fx-constant";
import { FxLambda } from "./fx-lambda";
import { FxFunction } from "./fx-function";
import { FxReference } from "./fx-reference";

export class FxObject extends FxExpression {
  public output: FxExpression;

  private readonly fields: FxField[];

  constructor() {
    super();
    this.fields = [];
  }

  protected get children(): FxExpression[] {
    if (this.output) {
      return [this.output];
    } else {
      return this.fields.concat();
    }
  }

  public addField(field: FxField): void {
    this.fields.push(field);
  }

  public evaluate(): any {
    // TODO: Reimplement optional (?) keys
    const result = {};

    if (this.output) {
      if (this.fields.length > 0) {
        throw new FxCompileError("Object with yield key \"()\" may only define variable and template keys", this.sourceRef);
      }
      return this.output.evaluate();
    }

    for (const field of this.fields) {
      field.evaluate().forEach(keyValue => result[keyValue.key] = keyValue.value);
    }

    return result;
  }

  public toString(): string {
    const vars = Object.keys(this.scope.variables).map(key => `${ key }: ${ this.scope.variables[key].toString() }`);
    let items = this.fields.map(field => field.toString());

    items = vars.concat(items);

    return `{${ items.join(", ") }}`;
  }
}
