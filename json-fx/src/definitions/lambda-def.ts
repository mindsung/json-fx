import { FxOperatorDefinition } from "../compiler/lexer/model/fx-definition";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxLambda } from "../compiler/runtime/model/fx-lambda";
import { FxDef } from "./model/fx-def";

export class LambdaDef extends FxDef {

  public get operator(): FxOperatorDefinition {
    return { symbol: "=>", precedence: 0 };
  }

  protected optimize(token: FxTokenNode): void {
    token.tag = "lambda";

    if (token.first.tag != "group") {
      const wrapper = new FxTokenNode("signature");
      wrapper.isLvalue = true;
      token.first.wrap(wrapper);
    } else {
      token.first.tag = "signature";
    }
  }

  protected compile(token: FxTokenNode): FxExpression {
    const paramNames = token.first.children.map(c => c.symbol);
    return new FxLambda(paramNames, token.last.compile());
  }
}
