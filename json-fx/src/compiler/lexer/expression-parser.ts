import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";

export class ExpressionParser implements FxParser<FxTokenNode, void> {
  private last: FxTokenNode;
  private next: FxTokenNode;

  parse(root: FxTokenNode): void {
    this.last = null;

    for (this.next of root.children) {
      if (this.lastWithNextIsCallable()) {
        this.makeLastAnExpression();
        this.next.orphan();

      } else {
        this.last = this.next;
      }
    }
  }

  private lastWithNextIsCallable() {
    return this.next.tag == "group"
      && this.last && (this.last.tag == "identifier" || this.last.tag == "template");
  }

  private makeLastAnExpression() {
    if (this.last.tag == "identifier") {
      this.last.tag = "expression";
    } else if (this.last.tag == "template") {
      this.last.tag = "template-call";
    }

    while (this.next.count) {
      this.last.add(this.next.first);
    }
  }
}
