import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxVariable } from "../compiler/runtime/model/fx-variable";

export class VariableDef extends FxDef {

  public get tag(): FxTokenTag { return "variable"; }

  protected compile(token: FxTokenNode): FxExpression {
    return new FxVariable(token.symbol);
  }
}

export class TemplateDef extends VariableDef {
  public get tag(): FxTokenTag { return "template"; }
}
