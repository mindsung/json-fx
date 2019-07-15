import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxToken } from "./model/fx-token";
import { FxSyntaxError } from "../fx-error";

export class Grouper implements FxParser<FxToken[], FxTokenNode> {
  private root: FxTokenNode;
  private nextToken: FxTokenNode;

  parse(tokens: FxToken[]): FxTokenNode {
    this.root = new FxTokenNode("group");

    for (const t of tokens) {
      this.nextToken = new FxTokenNode(t.tag, t.symbol, t.index);

      switch (this.nextToken.tag) {
        case "group":
          this.descendRoot();
          break;
        case "group-close":
          this.ascendRoot();
          break;
        default:
          this.root.add(this.nextToken);
          break;
      }
    }

    if (!this.rootIsClosed()) {
      throw new FxSyntaxError(`Unclosed "${ this.root.symbol }"`, this.root.index);
    }

    return this.root;
  }

  private descendRoot() {
    this.root.add(this.nextToken);
    this.root = this.nextToken;
  }

  private ascendRoot() {
    if (!this.closeBracketMatchesRoot()) {
      throw new FxSyntaxError(`Unexpected token "${ this.nextToken.symbol }"`, this.nextToken.index);
    }

    this.root.symbol += this.nextToken.symbol;

    switch (this.root.symbol) {
      case "[]":
        this.root.tag = "array";
        break;
      case "{}":
        this.root.tag = "object";
        break;
    }

    this.root = this.root.parent;
    this.nextToken.orphan();
  }

  private rootIsClosed() {
    return !this.root.parent;
  }

  private closeBracketMatchesRoot() {
    const open = this.root.symbol;
    const close = this.nextToken.symbol;

    return open == "(" && close == ")"
      || open == "[" && close == "]"
      || open == "{" && close == "}";
  }
}
