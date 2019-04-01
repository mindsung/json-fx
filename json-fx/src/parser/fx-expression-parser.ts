import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";

export class FxExpressionParser extends FxParser<FxNode, void> {
  evaluate(root: FxNode): void {
    let lastNode: FxNode = null;

    root.forEachChild(node => {
      if (node.isTagged("group", "open") && lastNode && lastNode.isTagged("identifier")) {
        lastNode.addTags("expression");
        node.transferChildren(lastNode);
        node.orphan();
      } else {
        lastNode = node;
      }
    });
  }
}
