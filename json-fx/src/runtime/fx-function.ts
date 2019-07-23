import { FxExpression } from "./fx-expression";
import { AnyFn } from "../model/fx-definition";

export class FxFunction extends FxExpression {
  public evaluator: AnyFn;
  public args: FxExpression[];
  public deferEvaluation: boolean;

  constructor(evaluator?: AnyFn, args?: FxExpression[]) {
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
