import { FxTokenNode } from "./model/fx-token-node";
import { FxParser } from "./model/fx-parser";

export abstract class IteratorParser implements FxParser<FxTokenNode> {

  private i: number;

  protected abstract parseItem(parent: FxTokenNode, current: FxTokenNode, next: FxTokenNode): void;

  public parse(token: FxTokenNode): void {
    if (token.count == 0) {
      return;
    }

    let current: FxTokenNode;

    for (this.i = 0; this.i < token.count; this.i++) {
      if (current) {
        this.parseItem(token, current, token.children[this.i]);
      }
      current = token.children[this.i];
    }

    this.parseItem(token, current, null);
    this.i = null;
  }

  protected moveLast(): void {
    if (this.i != null) {
      this.i--;
    }
  }

  protected moveNext(): void {
    if (this.i != null) {
      this.i++;
    }
  }
}
