import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";

export class ExpressionParser implements FxParser<FxTokenNode, void> {
  private last: FxTokenNode;
  private next: FxTokenNode;

  parse(root: FxTokenNode): void {
    this.last = null;

    for (this.next of root.children) {
      if (this.lastWithNextIsCallable()) {
        this.makeLastAnExpression();
        this.next.orphan();

      } else if (this.lastWithNextIsIndexer()) {
        // TODO: This is tightly coupled with item() expression
        this.next.unshift(this.last);
        this.next.tag = "expression";
        this.next.symbol = "item";
      } else {
        this.last = this.next;
      }
    }
  }

  private lastWithNextIsCallable(): boolean {
    return this.next.tag == "group"
      && this.last && (this.last.tag == "identifier" || this.last.tag == "template");
  }

  private lastWithNextIsIndexer(): boolean {
    return this.next.tag == "array"
      && this.last && (
        this.last.tag == "variable"
        || this.last.tag == "expression"
        || this.last.tag == "array"
        || this.last.tag == "object");
  }

  private makeLastAnExpression() {
    let group: FxTokenNode;

    if (this.last.tag == "identifier") {
      this.last.tag = "expression";
      group = this.last;
    } else if (this.last.tag == "template") {
      this.last.tag = "template-call";
      group = new FxTokenNode("signature");
      this.last.add(group);
    }

    while (this.next.count) {
      group.add(this.next.first);
    }
  }
}
