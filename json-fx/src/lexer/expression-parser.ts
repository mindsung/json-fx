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
    } else if (this.isKeyIndexer()) {
      this.convertToKeyIndexer();
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
    return this.next && this.next.is("array") && this.currentIsIndexable();
  }

  private convertToIndexer(): void {
    const indexer = new FxTokenNode("indexer");
    indexer.add(this.current);

    this.next.tag = "group";
    this.next.wrap(indexer);
  }

  private isKeyIndexer(): boolean {
    return this.next && this.next.is("object") && this.currentIsIndexable();
  }

  private convertToKeyIndexer(): void {
    const indexer = new FxTokenNode("key-indexer");
    indexer.add(this.current);

    this.next.tag = "group";
    this.next.wrap(indexer);
  }

  private currentIsIndexable(): boolean {
    return this.current.is(["literal", "identifier", "template-call", "variable", "expression", "array", "object"]);
  }
}
