import { FxTokenTag } from "../../model/fx-token-tag";
import { FxTokenNode } from "../../lexer/node/fx-token-node";
import { FxExpression } from "../../runtime/fx-expression";
import { FxObject } from "../../runtime/fx-object";
import { LambdaDef } from "./lambda-def";
import { FxDef } from "../../model/fx-def";
import { FxScopeVariable } from "../../runtime/scope/fx-scope-variable";
import { FxLambda } from "../../runtime/fx-lambda";
import { FxSyntaxError } from "../../model/fx-error";
import { FxDynamicField } from "../../runtime/fx-dynamic-field";
import { FxStaticField } from "../../runtime/fx-static-field";

export class ObjectDef extends FxDef {

  private lambda: LambdaDef;

  constructor() {
    super();
    this.lambda = new LambdaDef();
  }

  public get tag(): FxTokenTag { return "object"; }

  protected validate(token: FxTokenNode): void {
    for (const child of token.children) {
      if (!child.is("operator", ":_kv")) {
        throw new FxSyntaxError("Invalid object literal, expected key-value pairs", child.sourceRef);
      }
    }
  }

  protected compile(token: FxTokenNode): FxExpression {
    const result = new FxObject();

    for (const child of token.children) {
      if (child.count == 1) {
        result.output = child.first.compile();
      } else {
        const key = child.first;
        const value = child.last;

        switch (key.tag) {
          case "identifier":
          case "literal":
          case "numeric":
            result.addField(new FxStaticField(key.symbol, value.compile()));
            break;
          case "dynamic":
            result.addField(new FxDynamicField(key.first.compile(), new FxLambda(key.children.slice(1).map(c => c.symbol), value.compile())));
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
