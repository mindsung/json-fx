import { FxParser } from "../model/fx-parser";
import { FxNode } from "./node/fx-node";

export class RecursiveParser implements FxParser<FxNode, void> {
  public parsers: FxParser<FxNode, void>[];

  constructor(...parsers: FxParser<FxNode, void>[]) {
    this.parsers = parsers;
  }

  parse(root: FxNode): void {
    for (const parser of this.parsers) {
      this.parseTree(root, parser);
    }
  }

  private parseTree(root: FxNode, parser: FxParser<FxNode, void>): void {
    for (const node of root.children) {
      this.parseTree(node, parser);
    }
    parser.parse(root);
  }
}
