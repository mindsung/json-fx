import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../../lexer/model/fx-token-tag";
import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxVariableReference } from "../../runtime/model/fx-variable-reference";
import { FxFunction } from "../../runtime/model/fx-function";
import { AnyFn } from "../../lexer/model/fx-definition";

export class CallDef extends FxDef {

  public get tag(): FxTokenTag { return "template-call"; }

  protected compile(token: FxTokenNode): FxExpression {
    const result: FxExpression = new FxVariableReference(token.symbol);
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
