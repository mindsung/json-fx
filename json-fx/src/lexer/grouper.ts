import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxToken } from "./model/fx-token";
import { FxSyntaxError } from "../fx-error";

export class Grouper implements FxParser<FxToken[], FxTokenNode> {
  private root: FxTokenNode;
  private nextToken: FxTokenNode;

  public path: string;

  parse(tokens: FxToken[]): FxTokenNode {
    this.root = new FxTokenNode("group");
    this.root.sourceRef.path = this.path;

    for (const t of tokens) {
      this.nextToken = new FxTokenNode(t.tag, t.symbol, t.index);
      this.nextToken.sourceRef.path = this.path;

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
      throw new FxSyntaxError(`Unclosed "${ this.root.symbol }"`, this.root.sourceRef);
    }

    return this.root;
  }

  private descendRoot(): void {
    this.root.add(this.nextToken);
    this.root = this.nextToken;
  }

  private ascendRoot(): void {
    this.root.symbol += this.nextToken.symbol;

    switch (this.root.symbol) {
      case "()":
        break;
      case "[]":
        this.root.tag = "array";
        break;
      case "{}":
        this.root.tag = "object";
        break;
      default:
        throw new FxSyntaxError(`Unexpected token "${ this.nextToken.symbol }"`, this.nextToken.sourceRef);
    }

    this.root = this.root.parent;
    this.nextToken.orphan();
  }

  private rootIsClosed(): boolean {
    return !this.root.parent;
  }
}
