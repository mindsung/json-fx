import { FxIntrinsicDefinition, FxOperatorDefinition } from "../compiler/lexer/model/fx-definition";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxLambda } from "../compiler/runtime/model/fx-lambda";

export class LambdaDef implements FxIntrinsicDefinition {

  public get operator(): FxOperatorDefinition {
    return {symbol: "=>", precedence: 0};
  }

  public optimizer(token: FxTokenNode): void {
    token.tag = "lambda";

    if (token.first.tag != "group") {
      const wrapper = new FxTokenNode("signature");
      wrapper.isLvalue = true;
      token.first.wrap(wrapper);
    } else {
      token.first.tag = "signature";
    }
  }

  public compiler(token: FxTokenNode): FxExpression {
    const paramNames = token.first.children.map(c => c.symbol);
    return new FxLambda(paramNames, token.last.compile());
  }
}
