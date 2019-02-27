import {FxNodeParser} from "./fx-node-parser";
import {FxNode} from "./fx-node";

export class FxOptimizer extends FxNodeParser {
  evaluate(root: FxNode): void {
    root.forEachChild((index, node) => {
      if (node.isTagged("group") && node.count() <= 1) {
        node.unwrap();
      }
    });
  }
}
