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

  protected get children(): FxExpression[] { return this.args; }

  public evaluate(): any {
    const args = this.evaluateArgs();
    return this.evaluator(...args);
  }

  protected evaluateArgs(): any[] {
    return this.deferEvaluation ? this.args : this.args.map(p => p.evaluate());
  }

  public toString(): string {
    let result = this.sourceRef.symbol;
    if (this.args.length > 0) {
      result += `(${ this.args.map(arg => arg.toString()).join(", ") })`;
    }

    return result;
  }
}
