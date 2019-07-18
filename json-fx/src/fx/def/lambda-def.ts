import { FxOperatorDefinition } from "../../lexer/model/fx-definition";
import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxLambda } from "../../runtime/model/fx-lambda";
import { FxDef } from "./model/fx-def";

export class LambdaDef extends FxDef {

  public get operator(): FxOperatorDefinition {
    return { symbol: "=>", precedence: 0 };
  }

  protected optimize(token: FxTokenNode): void {
    if (token.first.tag != "group") {
      const wrapper = new FxTokenNode("args");
      wrapper.isLvalue = true;
      token.first.wrap(wrapper);
    } else {
      token.first.tag = "args";
    }
  }

  protected compile(token: FxTokenNode): FxExpression {
    const paramNames = token.first.children.map(c => c.symbol);
    return new FxLambda(paramNames, token.last.compile());
  }
}
