import { FxIntrinsicDefinition } from "../compiler/lexer/model/fx-definition";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { ExpressionDef } from "./expression-def";

export class OperatorDef implements FxIntrinsicDefinition {

  public get tag(): FxTokenTag { return "operator"; }

  public compiler(token: FxTokenNode): FxExpression {
    return ExpressionDef.compiler(token);
  }
}
