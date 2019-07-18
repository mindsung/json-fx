import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxCompileError } from "../../fx-error";
import { FxTokenTag } from "../../lexer/model/fx-token-tag";
import { FxDef } from "./model/fx-def";
import { FxFunction } from "../../runtime/model/fx-function";
import { FxConstant } from "../../runtime/model/fx-constant";

export class ExpressionDef extends FxDef {

  public get tag(): FxTokenTag {
    return "expression";
  }

  protected compile(token: FxTokenNode): FxExpression {
    const evaluator = token.evaluator;

    if (!evaluator) {
      throw new FxCompileError(`Expression "${token.symbol}" is undefined`, null);
    }

    const result = new FxFunction(evaluator.evaluate);
    result.args = token.children.map(child => child.compile());
    result.deferEvaluation = evaluator.deferEvaluation;

    return result;
  }
}

export class IdentifierDef extends ExpressionDef {

  public get tag(): FxTokenTag {
    return "identifier";
  }

  protected compile(token: FxTokenNode): FxExpression {
    if (token.evaluator) {
      return super.compile(token);
    } else {
      return new FxConstant(token.symbol);
    }
  }
}

export class OperatorDef extends ExpressionDef {
  public get tag(): FxTokenTag {
    return "operator";
  }
}
