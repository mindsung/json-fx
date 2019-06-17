import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";

export class FxOptimizer extends FxParser<FxNode> {
  evaluate(root: FxNode): void {
    root.forEachChild(node => {
      if (node.isTagged("group") && node.count() <= 1) {
        node.unwrap();
      }
    });
  }
}
