import { FxParser } from "./fx-parser";
import { FxNode } from "./fx-node";
import { FxModule } from "../core/fx-module";

export class FxNodeParser extends FxParser<FxNode, void> {
  public parsers: FxParser<FxNode, void>[];

  constructor(module: FxModule, ...parsers: FxParser<FxNode, void>[]) {
    super(module);
    this.parsers = parsers;
  }

  evaluate(root: FxNode): void {
    for (const parser of this.parsers) {
      this.evaluateTree(root, parser);
    }
  }

  private evaluateTree(root: FxNode, parser: FxParser<FxNode, void>) {
    root.forEachChild(node => {
      this.evaluateTree(node, parser);
    });

    parser.evaluate(root);
  }
}
