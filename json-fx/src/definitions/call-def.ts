import { FxDef } from "./model/fx-def";
import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxVariable } from "../compiler/runtime/model/fx-variable";
import { FxFunction } from "../compiler/runtime/model/fx-function";
import { FxLambdaFn } from "../defs";

export class CallDef extends FxDef {

  public get tag(): FxTokenTag { return "template-call"; }

  protected compile(token: FxTokenNode): FxExpression {
    const result: FxExpression = new FxVariable(token.symbol);
    let params: FxExpression[];

    if (token.first && token.first.tag == "signature") {
      params = token.first.children.map(child => child.compile());
    } else {
      params = token.children.map(child => child.compile());
    }

    return new FxFunction((lambda: FxLambdaFn, ...args: any[]) => {
      return lambda(...args);
    }, [result].concat(params));
  }
}
