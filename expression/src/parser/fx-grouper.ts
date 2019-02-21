import {FxParser} from "./fx-parser";
import {FxNode} from "./fx-node";

export class FxGrouper extends FxParser<FxNode[], FxNode> {
  constructor() {
    super(null);
  }

  private static bracketsMatch(open: string, close: string) {
    return open === "(" && close === ")"
      || open === "[" && close === "]"
      || open === "{" && close === "}";
  }

  private static nest(root: FxNode, lastToken: FxNode, nextToken: FxNode) {
    if (lastToken.isTagged("expression")) {
      return lastToken;
    } else {
      root.addChild(nextToken);
      return nextToken;
    }
  }

  private static getTokenType(token: FxNode): "open" | "close" | "value" {
    if (token.isTagged("group")) {
      if (token.isTagged("close")) {
        return "close";
      } else {
        return "open";
      }
    } else {
      return "value";
    }
  }

  evaluate(tokens: FxNode[]): FxNode {
    const global = new FxNode("global", "global");
    let root = global;

    const bracketStack: string[] = [];

    for (const child of tokens) {
      const type = FxGrouper.getTokenType(child);

      switch (type) {
        case "open":
          root.addChild(child);
          root = child;
          break;
        case "close":
          root = root.getParent();
          if (!FxGrouper.bracketsMatch(root.value, child.value)) {
            throw new Error("Brackets do not match");
          }
          break;
        case "value":
          root.addChild(child);
          break;
      }
    }

    if (root !== global) {
      throw new Error(`Unclosed "${root.value}"`);
    }

    return global;
  }
}
