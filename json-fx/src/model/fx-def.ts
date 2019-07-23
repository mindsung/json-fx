import { FxEvaluatorDefinition, FxIntrinsicDefinition, FxOperatorDefinition } from "./fx-definition";
import { FxTokenNode } from "../lexer/node/fx-token-node";
import { FxExpression } from "../runtime/fx-expression";
import { FxTokenTag } from "./fx-token-tag";

export type FxOptimizer = (token: FxTokenNode) => void;
export type FxCompiler = (token: FxTokenNode) => FxExpression;

export class FxDef implements FxIntrinsicDefinition {

  public get tag(): FxTokenTag { return undefined; }

  public get operator(): FxOperatorDefinition { return undefined; }

  public get evaluator(): FxEvaluatorDefinition { return undefined; }

  public get optimizer(): FxOptimizer {
    return this.optimize.bind(this);
  }

  public get compiler(): FxCompiler {
    return (token) => {
      const expression = this.compile(token);
      expression.sourceRef = token.sourceRef;

      return expression;
    };
  }

  protected optimize(token: FxTokenNode): void { return; }

  protected compile(token: FxTokenNode): FxExpression { return null; }
}
