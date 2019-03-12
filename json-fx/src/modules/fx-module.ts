import {FxOperator} from "../parser/fx-operator";

export class FxModule {
  protected operators: {} = {};

  public addOperators(...operators: Array<FxOperator>): FxModule {
    for (const op of operators) {
      this.operators[op.symbol] = op;
    }
    return this;
  }

  public getOperator(symbol: string): FxOperator {
    return this.operators[symbol] || null;
  }
}
