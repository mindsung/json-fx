import { FxIntrinsicDefinition } from "../compiler/lexer/model/fx-definition";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxArray } from "../compiler/runtime/model/fx-array";

export class GroupDef implements FxIntrinsicDefinition {

  public get tag(): FxTokenTag { return "group"; }

  public optimizer(token: FxTokenNode): void {
    if (token.parent && token.count <= 1) {
      token.unwrap();
    }
  }

  public compiler(token: FxTokenNode): FxExpression {
    if (token.parent) {
      return new FxArray(token.children.map(c => c.compile()));
    } else {
      return token.first.compile();
    }
  }
}
