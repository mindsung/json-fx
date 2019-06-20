import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";
import {FxToken} from "./model/fx-token";

export class FxGrouper extends FxParser<FxToken[], FxTokenNode> {
  private root: FxTokenNode;
  private nextToken: FxTokenNode;

  parse(tokens: FxToken[]): FxTokenNode {
    this.root = new FxTokenNode("", "global");

    for (const t of tokens) {
      this.nextToken = new FxTokenNode(t.symbol, t.tag, t.index);

      switch (this.nextToken.tag) {
        case "group":
          this.descendRoot();
          break;
        case "group-close":
          this.ascendRoot();
          break;
        default:
          this.root.pushChild(this.nextToken);
          break;
      }
    }

    if (!this.rootIsClosed()) {
      throw new Error(`Unclosed "${this.root.symbol}"`);
    }

    return this.root;
  }

  private descendRoot() {
    this.root.pushChild(this.nextToken);
    this.root = this.nextToken;
  }

  private ascendRoot() {
    if (!this.closeBracketMatchesRoot()) {
      throw new Error(`Unexpected token "${this.nextToken.symbol}"`);
    }

    this.root.symbol += this.nextToken.symbol;
    this.root = this.root.parent;
    this.nextToken.orphan();
  }

  private rootIsClosed() {
    return !this.root.parent;
  }

  private closeBracketMatchesRoot() {
    const open = this.root.symbol;
    const close = this.nextToken.symbol;

    return open === "(" && close === ")"
      || open === "[" && close === "]"
      || open === "{" && close === "}";
  }
}
