import { FxTokenNode } from "./node/fx-token-node";
import { FxParser } from "../model/fx-parser";

export abstract class IteratorParser implements FxParser<FxTokenNode> {

  protected abstract parseItem(current: FxTokenNode, next: FxTokenNode): void;

  protected before(parent: FxTokenNode): void {}

  protected after(): void {}

  public parse(token: FxTokenNode): void {
    this.before(token);

    if (token.count > 0) {
      const children = token.children;
      let current: FxTokenNode;


      for (let i = 0; i < children.length; i++) {
        const next = children[i];
        if (next.parent == token) {
          if (current) {
            this.parseItem(current, next);
          }
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
