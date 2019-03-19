import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";
import { FxModule } from "./fx-module";

export class FxExpressionParser extends FxParser<FxNode, void> {
  constructor(module: FxModule) {
    super(module);
  }

  evaluate(root: FxNode): void {
    let lastNode: FxNode = null;

    // const isGroup = root.isTagged("group");

    root.forEachChild((index, node) => {
      if (node.isTagged("group", "open") && lastNode && lastNode.isTagged("expression")) {
        node.transferChildren(lastNode);
        node.orphan();
      } else if (node.isTagged("expression")) {
        if (lastNode && lastNode.isTaggedAny("identifier", "expression")) {
          lastNode.setParent(node);
        }
        node.value = node.value.substr(1);
        lastNode = node;
      } else {
        lastNode = node;
      }
    });
  }
}
