import { FxEvaluatorDefinition, FxIntrinsicDefinition, FxOperatorDefinition } from "../../compiler/lexer/model/fx-definition";
import { FxTokenNode } from "../../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../../compiler/runtime/model/fx-expression";
import { FxTokenTag } from "../../compiler/lexer/model/fx-token-tag";

export type FxOptimizer = (token: FxTokenNode) => void;
export type IFxCompiler = (token: FxTokenNode) => FxExpression;

export class FxDef implements FxIntrinsicDefinition {

  public get tag(): FxTokenTag { return undefined; }

  public get operator(): FxOperatorDefinition { return undefined; }

  public get evaluator(): FxEvaluatorDefinition { return undefined; }

  public get optimizer(): FxOptimizer {
    return this.optimize.bind(this);
  }

  public get compiler(): IFxCompiler {
    return (token) => {
      const expression = this.compile(token);
      expression.sourceRef = { symbol: token.symbol, index: token.index, path: "" };

      return expression;
    };
  }

  protected optimize(token: FxTokenNode): void { return; }

  protected compile(token: FxTokenNode): FxExpression { return null; }
}
