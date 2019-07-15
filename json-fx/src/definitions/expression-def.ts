import { FxIntrinsicDefinition } from "../compiler/lexer/model/fx-definition";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxCompileError } from "../compiler/fx-error";
import { FxFunction } from "../compiler/runtime/model/fx-function";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxConstant } from "../compiler/runtime/model/fx-constant";

export class ExpressionDef implements FxIntrinsicDefinition {

  public get tag(): FxTokenTag { return "expression"; }

  public compiler(token: FxTokenNode): FxExpression {
    return ExpressionDef.compiler(token);
  }

  public static compiler(token: FxTokenNode): FxExpression {
    const evaluator = token.evaluator;

    if (!evaluator) {
      throw new FxCompileError(`Expression "${token.symbol}" is undefined`, token.index);
    }

    const result = new FxFunction(evaluator.evaluate);
    result.args = token.children.map(child => child.compile());
    result.deferEvaluation = evaluator.deferEvaluation;

    return result;
  }
}

export class IdentifierDef extends ExpressionDef {

  public get tag(): FxTokenTag { return "identifier"; }

  public compiler(token: FxTokenNode): FxExpression {
    if (token.evaluator) {
      return super.compiler(token);
    } else {
      return new FxConstant(token.symbol);
    }
  }
}
