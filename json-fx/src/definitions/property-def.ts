import { FxIntrinsicDefinition, FxOperatorDefinition } from "../compiler/lexer/model/fx-definition";
import { FxTokenNode } from "../compiler/lexer/model/fx-token-node";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
import { FxProperty, FxPropertyPathItem } from "../compiler/runtime/model/fx-property";
import { FxConstant } from "../compiler/runtime/model/fx-constant";

export class PropertyDef implements FxIntrinsicDefinition {

  public get operator(): FxOperatorDefinition {
    return {symbol: ".", precedence: 4};
  }

  public compiler(token: FxTokenNode): FxExpression {
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
