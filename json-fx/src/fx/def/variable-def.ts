import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../../lexer/model/fx-token-tag";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxVariableReference } from "../../runtime/model/fx-variable-reference";

export class VariableDef extends FxDef {

  public get tag(): FxTokenTag { return "variable"; }

  protected compile(token: FxTokenNode): FxExpression {
    return new FxVariableReference(token.symbol);
  }
}

export class TemplateDef extends VariableDef {
  public get tag(): FxTokenTag { return "template"; }
}
