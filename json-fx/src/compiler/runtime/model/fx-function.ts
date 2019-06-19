import { FxScope } from "../fx-scope";
import { FxExpression } from "./fx-expression";
import { FxLambdaFn } from "../../../defs";

export class FxFunction extends FxExpression {
  public evaluator: (...args: any[]) => any;
  public args: FxExpression[];
  public deferEvaluation: boolean;

  constructor(evaluator?: FxLambdaFn, args?: FxExpression[]) {
    super();
    this.evaluator = evaluator || null;
    this.args = args || [];
    this.deferEvaluation = false;
  }

  public evaluate() {
    const args = this.evaluateArgs();
    return this.evaluator(...args);
  }

  protected evaluateArgs() {
    return this.deferEvaluation ? this.args : this.args.map(p => p.evaluate());
  }

  public bindScope(root: FxScope = null) {
    super.bindScope(root);
    this.args.forEach(arg => arg.bindScope(this.scope));
  }

  public toString(): string {
    let result = this.sourceRef.symbol;
    if (this.args.length > 0) {
      result += `(${this.args.map(arg => arg.toString()).join(", ")})`;
    }

    return result;
  }
}
