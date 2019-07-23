import { FxDef } from "../../model/fx-def";
import { FxTokenTag } from "../../model/fx-token-tag";
import { FxTokenNode } from "../../lexer/node/fx-token-node";
import { FxExpression } from "../../runtime/fx-expression";
import { FxReference } from "../../runtime/fx-reference";
import { FxFunction } from "../../runtime/fx-function";
import { AnyFn } from "../../model/fx-definition";

export class CallDef extends FxDef {

  public get tag(): FxTokenTag { return "template-call"; }

  protected compile(token: FxTokenNode): FxExpression {
    const result: FxExpression = new FxReference(token.symbol);
    let params: FxExpression[];

    if (token.first && token.first.tag == "args") {
      params = token.first.children.map(child => child.compile());
    } else {
      params = token.children.map(child => child.compile());
    }

    return new FxFunction((lambda: AnyFn, ...args: any[]) => {
      return lambda(...args);
    }, [result].concat(params));
  }
}
