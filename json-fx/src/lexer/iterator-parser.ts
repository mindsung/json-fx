import { FxTokenNode } from "./model/fx-token-node";
import { FxParser } from "./model/fx-parser";

export abstract class IteratorParser implements FxParser<FxTokenNode> {

  private i: number;

  protected abstract parseItem(current: FxTokenNode, next: FxTokenNode): void;

  public parse(item: FxTokenNode): void {
    if (item.count == 0) {
      return;
    }

    let current: FxTokenNode;

    for (this.i = 0; this.i < item.count; this.i++) {
      if (current) {
        this.parseItem(current, item.children[this.i]);
      }
      current = item.children[this.i];
    }

    this.parseItem(current, null);
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
