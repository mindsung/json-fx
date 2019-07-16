import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxArray } from "../compiler/runtime/model/fx-array";

export class ArrayDef extends FxDef {

  public get tag(): FxTokenTag { return "array"; }

  protected compile(token: FxTokenNode): FxExpression {
    const items = token.children.map(child => child.compile());
    return new FxArray(items);
  }
}
