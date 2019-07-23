import { FxTokenNode } from "./node/fx-token-node";
import { IteratorParser } from "./iterator-parser";

export class ExpressionParser extends IteratorParser {

  private parent: FxTokenNode;
  private current: FxTokenNode;
  private next: FxTokenNode;

  protected before(parent: FxTokenNode): void {
    this.parent = parent;
  }

  protected parseItem(current: FxTokenNode, next: FxTokenNode): void {
    this.current = current;
    this.next = next;

    if (this.isCall()) {
      this.convertToCall();
    } else if (this.isIndexer()) {
      this.convertToIndexer();
    }
  }

  private isCall(): boolean {
    return this.next && this.next.is("group") && this.current.is(["identifier", "template"]);
  }

  private convertToCall(): void {
    if (this.current.is("template")) {
      this.current.tag = "template-call";
    }

    while (this.next.first) {
      this.current.add(this.next.first);
    }

    this.next.orphan();
  }

  private isIndexer(): boolean {
    return this.next && this.next.is("array") && this.current.is(["literal", "identifier", "template-call", "variable", "expression", "array", "object"]);
  }

  private convertToIndexer(): void {
    this.next.tag = "indexer";
    this.next.add(this.current, 0);
  }
}
