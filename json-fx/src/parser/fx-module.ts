import {FxOperator} from "./fx-operator";
import { ExpressionSet } from "../core/expression-set";
import { ExpressionScope } from "../core/expression";

export class FxModule {
  constructor(public exprSet: ExpressionSet = new ExpressionSet()) {
    this.addOperators(new FxOperator("=", "set", 0));
    this.addOperators(...Object.keys(exprSet.tokenMap).map(k =>
      new FxOperator(k, exprSet.tokenMap[k].key, exprSet.tokenMap[k].token.precedence, exprSet.tokenMap[k].token.assoc || "left", exprSet.tokenMap[k].token.operandOn || "both")));
  }

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
