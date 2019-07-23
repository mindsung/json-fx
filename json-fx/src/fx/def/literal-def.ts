import { FxDef } from "../../model/fx-def";
import { FxTokenTag } from "../../model/fx-token-tag";
import { FxConstant } from "../../runtime/fx-constant";
import { FxExpression } from "../../runtime/fx-expression";
import { FxTokenNode } from "../../lexer/node/fx-token-node";

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
