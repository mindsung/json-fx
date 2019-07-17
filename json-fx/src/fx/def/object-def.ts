import { FxTokenTag } from "../../lexer/model/fx-token-tag";
import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxObject } from "../../runtime/model/fx-object";
import { LambdaDef } from "./lambda-def";
import { FxDef } from "./model/fx-def";
import { FxScopeVariable } from "../../runtime/model/fx-scope-variable";

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
          result.scope.setVariable(new FxScopeVariable(child.symbol, child.first.compile()));
          break;
        case "template":
          result.scope.setVariable(new FxScopeVariable(child.symbol, this.lambda.compiler(child), false));
          break;
      }
    }

    return result;
  }
}
