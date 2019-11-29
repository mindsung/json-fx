import { FxTokenNode } from "./node/fx-token-node";
import { Loader } from "./loader";
import { IteratorParser } from "./iterator-parser";
import { Fx } from "../fx";

export class OperatorLoader extends IteratorParser {

  private readonly loader: Loader;

  private parent: FxTokenNode;
  private current: FxTokenNode;
  private prev: FxTokenNode;

  // TODO: Change to "isAssignment" and invert all conditionals
  private isNotAssignment: boolean;

  constructor(loader: Loader) {
    super();
    this.loader = loader;
  }

  protected before(parent: FxTokenNode): void {
    this.parent = parent;
    this.prev = null;
    this.isNotAssignment = true;
  }

  protected after(): void {
    // Ensures root operator is loaded since its null parent won't load its child operators
    if (this.parent.parent == null) {
      this.loadOperator(this.parent);
    }
  }

  protected parseItem(current: FxTokenNode, next: FxTokenNode): void {
    this.current = current;

    if (this.parent.is("object")) {
      this.parseObject();
    } else if (this.isUnaryMinus()) {
      this.current.symbol = Fx.SymbolNegative;
    }

    this.loadOperator(current);
    this.prev = current;
  }

  private loadOperator(token: FxTokenNode): void {
    if (token.is(["literal", "numeric"])) {
      return;
    }

    const op = this.loader.getOperator(token.symbol);
    if (op) {
      token.operator = op;
      token.tag = "operator";
    }
  }

  private parseObject(): void {
    if (this.current.is("object") && this.isNotAssignment) {
      this.current.tag = "dynamic";

      // TODO: This prevents inline object literals passed as a dynamic key emitter from being classified as dynamic. Implementation is messy.
      if (this.current.first && this.current.first.is("dynamic")) {
        this.current.first.tag = "object";
      }

    } else if (this.isAssignment()) {
      this.current.symbol = Fx.SymbolAssign;
      this.isNotAssignment = false;
    } else if (this.isComma()) {
      this.isNotAssignment = true;
    }
  }

  private isUnaryMinus(): boolean {
    return this.current.is("operator", "-") && (!this.prev || this.prev.is("operator"));
  }

  private isAssignment(): boolean {
    return this.current.is("operator", ":") && this.isNotAssignment;
  }

  private isComma(): boolean {
    return this.current.is("operator", ",");
  }
}
