import { FxParser } from "./model/fx-parser";
import { FxNode } from "./model/fx-node";

export class FxNodeParser extends FxParser<FxNode, void> {
  public parsers: FxParser<FxNode, void>[];

  constructor(...parsers: FxParser<FxNode, void>[]) {
    super();
    this.parsers = parsers;
  }

  evaluate(root: FxNode): void {
    for (const parser of this.parsers) {
      this.evaluateTree(root, parser);
    }
  }

  private evaluateTree(root: FxNode, parser: FxParser<FxNode, void>) {
    for (const node of root.children) {
      this.evaluateTree(node, parser);
    }
    parser.evaluate(root);
  }
}
