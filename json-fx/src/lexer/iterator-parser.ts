import { FxTokenNode } from "./node/fx-token-node";
import { FxParser } from "../model/fx-parser";

export abstract class IteratorParser implements FxParser<FxTokenNode> {

  protected abstract parseItem(current: FxTokenNode, next: FxTokenNode): void;

  protected before(parent: FxTokenNode): void {}

  protected after(): void {}

  public parse(token: FxTokenNode): void {
    this.before(token);

    if (token.count > 0) {
      let current: FxTokenNode;

      for (const next of token.children) {
        if (current) {
          this.parseItem(current, next);
        }
        if (next.parent == token) {
          current = next;
        }
      }

      if (current.parent == token) {
        this.parseItem(current, null);
      }
    }

    this.after();
  }
}
