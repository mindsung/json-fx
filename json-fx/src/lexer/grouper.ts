import { FxParser } from "../model/fx-parser";
import { FxTokenNode } from "./node/fx-token-node";
import { FxToken } from "../model/fx-token";
import { FxSyntaxError } from "../model/fx-error";

export class Grouper implements FxParser<FxToken[], FxTokenNode> {

  public path: string;

  private root: FxTokenNode;
  private current: FxTokenNode;

  parse(tokens: FxToken[]): FxTokenNode {
    this.root = new FxTokenNode("group");
    this.root.sourceRef.path = this.path || "";

    for (const t of tokens) {
      this.current = new FxTokenNode(t.tag, t.symbol, t.index);
      this.current.sourceRef.path = this.path || "";

      switch (this.current.tag) {
        case "group":
          this.descendRoot();
          break;
        case "group-close":
          this.ascendRoot();
          break;
        default:
          this.root.add(this.current);
          break;
      }
    }

    if (!this.rootIsClosed()) {
      throw new FxSyntaxError(`Unclosed "${ this.root.symbol }"`, this.root.sourceRef);
    }

    return this.root;
  }

  private descendRoot(): void {
    this.root.add(this.current);
    this.root = this.current;
  }

  private ascendRoot(): void {
    const brackets = this.root.symbol + this.current.symbol;

    switch (brackets) {
      case "()":
        break;
      case "[]":
        this.root.tag = "array";
        break;
      case "{}":
        this.root.tag = "object";
        break;
      default:
        throw new FxSyntaxError(`Unexpected "${ this.current.symbol }"`, this.current.sourceRef);
    }

    this.root = this.root.parent;
    this.current.orphan();
  }

  private rootIsClosed(): boolean {
    return !this.root.parent;
  }
}
