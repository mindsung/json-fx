import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";
import {FxToken} from "./model/fx-token";

export class FxGrouper extends FxParser<FxToken[], FxTokenNode> {
  private root: FxTokenNode;
  private nextToken: FxTokenNode;

  private static get global() {
    return new FxTokenNode("global", "global", -1);
  }

  parse(tokens: FxToken[]): FxTokenNode {
    this.root = FxGrouper.global;

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

    if (this.rootIsNotClosed()) {
      throw new Error(`Unclosed "${this.root.symbol}"`);
    }

    return this.root;
  }

  private descendRoot() {
    this.root.pushChild(this.nextToken);
    this.root = this.nextToken;
  }

  private ascendRoot() {
    if (!this.nextBracketMatchesRoot()) {
      throw new Error("Brackets do not match");
    }

    this.root.pushChild(this.nextToken);

    this.root.symbol += this.nextToken.symbol;
    this.root = this.root.parent;
    this.nextToken.orphan();
  }

  private rootIsNotClosed() {
    return !!this.root.parent;
  }

  private nextBracketMatchesRoot() {
    const open = this.root.symbol;
    const close = this.nextToken.symbol;

    return open === "(" && close === ")"
      || open === "[" && close === "]"
      || open === "{" && close === "}";
  }
}
