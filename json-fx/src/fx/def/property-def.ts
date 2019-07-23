import { FxOperatorDefinition } from "../../model/fx-definition";
import { FxTokenNode } from "../../lexer/node/fx-token-node";
import { FxExpression } from "../../runtime/fx-expression";
import { FxProperty, FxPropertyPathItem } from "../../runtime/fx-property";
import { FxConstant } from "../../runtime/fx-constant";
import { FxDef } from "../../model/fx-def";

export class PropertyDef extends FxDef {

  public get operator(): FxOperatorDefinition {
    return {symbol: ".", precedence: 4};
  }

  protected compile(token: FxTokenNode): FxExpression {
    return new FxProperty(PropertyDef.getPropertyPath(token));
  }

  private static getPropertyPath(root: FxTokenNode): FxPropertyPathItem[] {
    if (PropertyDef.isProp(root) || PropertyDef.isNullProp(root)) {
      const last = {
        value: new FxConstant(root.last.symbol),
        interrupts: false
      };

      const path = [...PropertyDef.getPropertyPath(root.first), last];

      if (PropertyDef.isNullProp(root)) {
        path[path.length - 2].interrupts = true;
      }

      return path;

    } else {
      return [{
        value: root.compile(),
        interrupts: false
      }];
    }
  }

  private static isProp(node: FxTokenNode): boolean {
    return node.tag == "operator" && (node.symbol == "." || node.symbol == "?.");
  }

  private static isNullProp(node: FxTokenNode): boolean {
    return node.tag == "operator" && node.symbol == "?.";
  }
}

export class NullPropertyDef extends PropertyDef {

  public get operator(): FxOperatorDefinition {
    return {symbol: "?.", precedence: 4};
  }
}
