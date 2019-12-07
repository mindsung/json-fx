import { FxParser } from "../model/fx-parser";
import { FxNode } from "./node/fx-node";

interface RecursiveParserItem {
  parser: FxParser<FxNode>;
  rootFirst?: boolean;
}

export class RecursiveParser implements FxParser<FxNode> {

  private readonly parsers: RecursiveParserItem[];

  constructor(...parsers: RecursiveParserItem[]) {
    this.parsers = parsers;
  }

  public parse(root: FxNode): void {
    for (const item of this.parsers) {
      this.parseRecursive(root, item);
    }
  }

  private parseRecursive(root: FxNode, item: RecursiveParserItem): void {
    if (item.rootFirst) {
      item.parser.parse(root);
    }

    for (const node of root.children) {
      this.parseRecursive(node, item);
    }

    if (!item.rootFirst) {
      item.parser.parse(root);
    }
  }
}
