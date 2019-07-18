import { FxTokenNode } from "./model/fx-token-node";
import { IteratorParser } from "./iterator-parser";
import { Loader } from "./loader";

export class ExpressionParser extends IteratorParser {

  private loader: Loader;

  private current: FxTokenNode;
  private next: FxTokenNode;

  constructor(loader: Loader) {
    super();
    this.loader = loader;
  }

  protected parseItem(current: FxTokenNode, next: FxTokenNode): void {
    this.current = current;
    this.next = next;

    if (this.isCall()) {
      this.convertToCall();
      super.moveLast();
    } else if (this.isIndexer()) {
      this.convertToIndexer();
      super.moveLast();
    }
  }

  private isCall(): boolean {
    return this.next && this.next.tag == "group"
      && (this.current.tag == "identifier" || this.current.tag == "template");
  }

  private convertToCall(): void {
    const args = this.loader.createToken("args");

    if (this.current.tag == "identifier") {
      this.current.tag = "expression";
    } else if (this.current.tag == "template") {
      this.current.tag = "template-call";
    }

    while (this.next.first) {
      args.add(this.next.first);
    }

    this.current.add(args);
    this.next.orphan();
  }

  private isIndexer(): boolean {
    return this.next && this.next.tag == "array"
      && (this.current.tag == "variable"
        || this.current.tag == "expression"
        || this.current.tag == "array"
        || this.current.tag == "object");
  }

  private convertToIndexer(): void {
    const indexer = this.loader.createToken("indexer");
    indexer.add(this.current);
    indexer.add(this.next);
  }

  private;
}
