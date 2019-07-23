import { FxDef } from "../../model/fx-def";
import { FxTokenTag } from "../../model/fx-token-tag";
import { FxExpression } from "../../runtime/fx-expression";
import { FxTokenNode } from "../../lexer/node/fx-token-node";
import { FxArray } from "../../runtime/fx-array";

export class ArrayDef extends FxDef {

  public get tag(): FxTokenTag { return "array"; }

  protected compile(token: FxTokenNode): FxExpression {
    const items = token.children.map(child => child.compile());
    return new FxArray(items);
  }
}
