import { FxScope } from "../fx-scope";
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

  public evaluate() {
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

  public bindScope(root: FxScope = null) {
    super.bindScope(root);
    this.expression.bindScope(this.scope);
  }

  public toString(): string {
    return `(${this.varNames.join(", ")}) => ${this.expression.toString()}`;
  }
}
