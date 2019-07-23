import { FxTokenNode } from "./node/fx-token-node";
import { FxParser } from "../model/fx-parser";
import { Loader } from "./loader";
import { IteratorParser } from "./iterator-parser";

export class OperatorLoader extends IteratorParser {

  private readonly loader: Loader;

  private parent: FxTokenNode;
  private current: FxTokenNode;
  private prev: FxTokenNode;

  private expectAssign: boolean;

  constructor(loader: Loader) {
    super();
    this.loader = loader;
  }

  protected before(parent: FxTokenNode): void {
    this.parent = parent;
    this.prev = null;
    this.expectAssign = true;
  }

  protected after(): void {
    if (this.parent.parent == null) {
      this.loadOperator(this.parent);
    }
  }

  protected parseItem(current: FxTokenNode, next: FxTokenNode): void {
    this.current = current;

    if (this.parent.is("object")) {
      this.parseObject();
    } else if (this.isUnaryMinus()) {
      this.current.symbol = "-u";
    }

    this.loadOperator(current);
    this.prev = current;
  }

  private loadOperator(token: FxTokenNode): void {
    if (token.is("literal") || token.is("numeric")) {
      return;
    }

    const op = this.loader.getOperator(token.symbol);
    if (op) {
      token.operator = op;
      token.tag = "operator";
    }
  }

  private parseObject(): void {
    if (this.isAssignment()) {
      this.current.symbol = ":a";
      this.expectAssign = false;
    } else if (this.isComma()) {
      this.expectAssign = true;
    }
  }

  private isUnaryMinus(): boolean {
    return this.current.is("operator", "-") && (!this.prev || this.prev.is("operator"));
  }

  private isAssignment(): boolean {
    return this.current.is("operator", ":") && this.expectAssign;
  }

  private isComma(): boolean {
    return this.current.is("operator", ",");
  }
}
