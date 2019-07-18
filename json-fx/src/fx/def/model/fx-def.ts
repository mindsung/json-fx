import { FxEvaluatorDefinition, FxIntrinsicDefinition, FxOperatorDefinition } from "../../../lexer/model/fx-definition";
import { FxTokenNode } from "../../../lexer/model/fx-token-node";
import { FxExpression } from "../../../runtime/model/fx-expression";
import { FxTokenTag } from "../../../lexer/model/fx-token-tag";

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
      expression.sourceRef = token.sourceRef;

      return expression;
    };
  }

  protected optimize(token: FxTokenNode): void { return; }

  protected compile(token: FxTokenNode): FxExpression { return null; }
}
