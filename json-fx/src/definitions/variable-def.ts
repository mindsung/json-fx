import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxVariableReference } from "../compiler/runtime/model/fx-variable-reference";

export class VariableDef extends FxDef {

  public get tag(): FxTokenTag { return "variable"; }

  protected compile(token: FxTokenNode): FxExpression {
    return new FxVariableReference(token.symbol);
  }
}

export class TemplateDef extends VariableDef {
  public get tag(): FxTokenTag { return "template"; }
}
