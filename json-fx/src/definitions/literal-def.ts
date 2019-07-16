import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxConstant } from "../compiler/runtime/model/fx-constant";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";

export class StringLiteralDef extends FxDef {

  public get tag(): FxTokenTag { return "literal"; }

  protected compile(token: FxTokenNode): FxExpression {
    return new FxConstant(token.symbol);
  }
}

export class NumberLiteralDef extends FxDef {

  public get tag(): FxTokenTag { return "numeric"; }

  protected compile(token: FxTokenNode): FxExpression {
    return new FxConstant(parseFloat(token.symbol));
  }
}
