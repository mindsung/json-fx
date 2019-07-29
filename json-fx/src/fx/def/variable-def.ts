import { FxDef } from "../../model/fx-def";
import { FxTokenTag } from "../../model/fx-token-tag";
import { FxExpression } from "../../runtime/fx-expression";
import { FxTokenNode } from "../../lexer/node/fx-token-node";
import { FxReference } from "../../runtime/fx-reference";

export class VariableDef extends FxDef {

  public get tag(): FxTokenTag { return "variable"; }

  protected compile(token: FxTokenNode): FxExpression {
    return new FxReference(token.symbol);
  }
}

export class TemplateDef extends VariableDef {
  public get tag(): FxTokenTag { return "template"; }
}
