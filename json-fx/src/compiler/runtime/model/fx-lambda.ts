import { FxExpression } from "./fx-expression";
import { FxConstant } from "./fx-constant";

export class FxLambda extends FxExpression {
  public readonly varNames: string[];
  public expression: FxExpression;

  constructor(varNames: string[], expression: FxExpression) {
    super();
    this.varNames = varNames;
    this.expression = expression;
  }

  protected get children(): FxExpression[] { return [this.expression]; }

  public evaluate(): (...vars: any[]) => any {
    return (...vars: any[]) => {
      for (let i = 0; i < this.varNames.length; i++) {
        if (vars[i] != undefined) {
          this.scope.setVariable(this.varNames[i], new FxConstant(vars[i]));
        } else {
          this.scope.setVariable(this.varNames[i], undefined);
        }
      }

      return this.expression.evaluate();
    };
  }

  public toString(): string {
    return `(${ this.varNames.join(", ") }) => ${ this.expression.toString() }`;
  }
}
