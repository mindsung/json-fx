import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../../lexer/model/fx-token-tag";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxArray } from "../../runtime/model/fx-array";

export class ArrayDef extends FxDef {

  public get tag(): FxTokenTag { return "array"; }

  protected compile(token: FxTokenNode): FxExpression {
    const items = token.children.map(child => child.compile());
    return new FxArray(items);
  }
}
