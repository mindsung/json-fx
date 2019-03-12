import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";
import { FxModule } from "./fx-module";

export class FxExpressionParser extends FxParser<FxNode, void> {
  constructor(module: FxModule) {
    super(module);
  }

  private static nestParameters(root: FxNode, buffer: FxNode[]): FxNode {
    const paramGroup = new FxNode(null, "parameter", "group");
    while (buffer.length > 0) {
      paramGroup.addChild(buffer.shift());
    }
    root.addChild(paramGroup);
    return paramGroup;
  }

  evaluate(root: FxNode): void {
    let lastNode: FxNode = null;
    const paramBuffer: FxNode[] = [];

    const isGroup = root.isTagged("group");

    root.forEachChild((index, node) => {
      if (node.isTagged("group", "open") && lastNode.isTagged("expression")) {
        node.transferChildren(lastNode);
        node.orphan();
        paramBuffer.push(lastNode);
      } else if (node.isTagged("expression")) {
        if (lastNode && lastNode.isTaggedAny("identifier", "expression")) {
          lastNode.setParent(node);
        }
        node.value = node.value.substr(1);
        lastNode = node;
      } else if (isGroup && node.isTagged("delimiter")) {
        lastNode = FxExpressionParser.nestParameters(root, paramBuffer);
        node.orphan();
      } else {
        paramBuffer.push(node);
        lastNode = node;
      }
    });

    if (isGroup) {
      FxExpressionParser.nestParameters(root, paramBuffer);
    }
  }
}
