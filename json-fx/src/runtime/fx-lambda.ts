import { FxExpression } from "./fx-expression";
import { FxConstant } from "./fx-constant";
import { FxScopeVariable } from "./scope/fx-scope-variable";
import { AnyFn } from "../model/fx-definition";

export class FxLambda extends FxExpression {
  public readonly varNames: string[];
  public expression: FxExpression;

  constructor(varNames: string[], expression: FxExpression) {
    super();
    this.varNames = varNames;
    this.expression = expression;
  }

  protected get children(): FxExpression[] { return [this.expression]; }

  public evaluate(): AnyFn {
    return this.evaluator.bind(this);
  }

  public evaluator(...vars: any[]): any {
    for (let i = 0; i < this.varNames.length; i++) {
      if (vars[i] != undefined) {
        this.scope.setVariable(new FxScopeVariable(this.varNames[i], new FxConstant(vars[i]), false));
      } else {
        this.scope.setVariable(new FxScopeVariable(this.varNames[i], undefined, false));
      }
    }

    return this.expression.evaluate();
  }

  public toString(): string {
    return `(${ this.varNames.join(", ") }) => ${ this.expression.toString() }`;
  }
}
