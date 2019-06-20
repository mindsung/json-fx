import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";

export class FxExpressionParser extends FxParser<FxTokenNode, void> {
  private lastNode: FxTokenNode;
  private nextNode: FxTokenNode;

  parse(root: FxTokenNode): void {
    this.lastNode = null;

    for (this.nextNode of root.children) {
      if (this.lastWithNextIsCallable()) {
        this.makeLastAnExpression();
        this.nextNode.orphan();

      } else {
        this.lastNode = this.nextNode;
      }
    }
  }

  private makeLastAnExpression() {
    if (this.lastNode.tag === "identifier") {
      this.lastNode.tag = "expression";
    } else if (this.lastNode.tag === "template") {
      this.lastNode.tag = "template-call";
    }

    this.nextNode.transferChildrenTo(this.lastNode);
  }

  private lastWithNextIsCallable() {
    return this.nextNode.tag === "group"
      && this.lastNode && (this.lastNode.tag === "identifier" || this.lastNode.tag === "template");
  }
}
