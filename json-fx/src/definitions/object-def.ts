import { FxTokenTag } from "../compiler/lexer/model/fx-token-tag";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxObject } from "../compiler/runtime/model/fx-object";
import { LambdaDef } from "./lambda-def";
import { FxDef } from "./model/fx-def";

export class ObjectDef extends FxDef {

  private lambda: LambdaDef;

  constructor() {
    super();
    this.lambda = new LambdaDef();
  }

  public get tag(): FxTokenTag { return "object"; }

  protected compile(token: FxTokenNode): FxExpression {
    const result = new FxObject();

    for (const child of token.children) {
      switch (child.tag) {
        case "identifier":
          result.items[child.symbol] = child.first.compile();
          break;
        case "variable":
          result.scope.setVariable(child.symbol, child.first.compile());
          break;
        case "template":
          result.scope.setVariable(child.symbol, this.lambda.compiler(child));
          break;
      }
    }

    return result;
  }
}
