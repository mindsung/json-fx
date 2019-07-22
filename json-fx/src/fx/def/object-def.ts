import { FxTokenTag } from "../../lexer/model/fx-token-tag";
import { FxTokenNode } from "../../lexer/model/fx-token-node";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxObject } from "../../runtime/model/fx-object";
import { LambdaDef } from "./lambda-def";
import { FxDef } from "./model/fx-def";
import { FxScopeVariable } from "../../runtime/model/fx-scope-variable";
import { FxLambda } from "../../runtime/model/fx-lambda";
import { FxSyntaxError } from "../../fx-error";

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
      if (!child.is("operator", ":a")) {
        throw new FxSyntaxError("Invalid object literal, expected key-value pairs", child.sourceRef);
      }

      if (child.count == 1) {
        result.output = child.first.compile();
      } else {
        const key = child.first;
        const value = child.last;

        switch (key.tag) {
          case "identifier":
            result.items[key.symbol] = value.compile();
            break;
          case "variable":
            result.scope.setVariable(new FxScopeVariable(key.symbol, value.compile()));
            break;
          case "template":
          case "template-call":
            const paramNames = key.children.map(c => c.symbol);
            result.scope.setVariable(new FxScopeVariable(key.symbol, new FxLambda(paramNames, value.compile()), false));
            break;
        }
      }
    }

    return result;
  }
}
