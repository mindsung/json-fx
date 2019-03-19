import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";
import { FxModule } from "./fx-module";

export class FxDelimiterParser extends FxParser<FxNode, void> {
  constructor(module: FxModule) {
    super(module);
  }

  private static nestGroupParameters(root: FxNode, buffer: FxNode[]): FxNode {
    const paramGroup = new FxNode(null, "parameter", "group");
    while (buffer.length > 0) {
      paramGroup.addChild(buffer.shift());
    }
    root.addChild(paramGroup);
    return paramGroup;
  }

  evaluate(root: FxNode): void {
    const groupParamBuffer: FxNode[] = [];

    if (!root.isTagged("group")) { return; }

    root.forEachChild((index, node) => {
      if (node.isTagged("delimiter")) {
        FxDelimiterParser.nestGroupParameters(root, groupParamBuffer);
        node.orphan();
      } else {
        groupParamBuffer.push(node);
      }
    });

    FxDelimiterParser.nestGroupParameters(root, groupParamBuffer);
  }
}
