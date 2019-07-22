import { FxDef } from "./model/fx-def";
import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxFunction } from "../../runtime/model/fx-function";
import { FxOperatorDefinition } from "../../lexer/model/fx-definition";

export class InvokeDef extends FxDef {

  public get operator(): FxOperatorDefinition {
    return { symbol: ":", precedence: 4 };
  }

  protected optimize(token: FxTokenNode): void {
    token.last.add(token.first, 0);

    if (token.last.tag == "identifier") {
      token.last.tag = "expression";
    }

    token.unwrap();
  }
}

export class NullInvokeDef extends FxDef {

  public get operator(): FxOperatorDefinition {
    return { symbol: "?:", precedence: 4 };
  }

  protected optimize(token: FxTokenNode): void {
    token.last.add(token.first, 0);
  }

  protected compile(token: FxTokenNode): FxExpression {
    const result = new FxFunction();
    result.deferEvaluation = true;

    result.evaluator = (fn: FxFunction): any => {
      if (fn.args[0].evaluate() == null) {
        return null;
      } else {
        return fn.evaluate();
      }
    };

    result.args = [token.first.compile()];
    return result;
  }
}
