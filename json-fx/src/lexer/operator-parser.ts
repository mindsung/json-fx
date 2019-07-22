import { FxTokenNode } from "./model/fx-token-node";
import { IteratorParser } from "./iterator-parser";
import { Loader } from "./loader";

export class OperatorParser extends IteratorParser {

  private operatorStack: FxTokenNode[];
  private outputQueue: FxTokenNode[];

  private current: FxTokenNode;
  private next: FxTokenNode;

  protected before(parent: FxTokenNode): void {
    this.operatorStack = [];
    this.outputQueue = [];
  }

  protected after(): void {
    while (this.operatorStack.length > 0) {
      this.popOperator();
    }
  }

  protected parseItem(current: FxTokenNode, next: FxTokenNode): void {
    this.current = current;
    this.next = next;

    if (this.current.tag == "operator") {
      this.parseOperator();
    } else {
      this.outputQueue.push(this.current);
    }
  }

  private parseOperator(): void {
    if (this.current.operator.isUnary) {
      this.parseUnary();
    } else {
      this.parseBinary();
    }
  }

  private parseUnary(): void {
    if (this.current.operator.assoc == "right") {
      this.current.add(this.outputQueue.pop());
      this.outputQueue.push(this.current);
    } else {
      this.current.add(this.next);
      this.outputQueue.push(this.current);
    }
  }

  private parseBinary(): void {
    const currentOp = this.current.operator;
    let stackOp = this.operatorStack[0] && this.operatorStack[0].operator;

    while (stackOp && stackOp.precedence >= currentOp.precedence && currentOp.assoc != "right") {
      this.popOperator();
      stackOp = this.operatorStack[0] && this.operatorStack[0].operator;
    }

    this.operatorStack.unshift(this.current);
  }

  private popOperator(): void {
    const stackTop = this.operatorStack.shift();

    if (this.outputQueue.length >= 2) {
      stackTop.unshift(this.outputQueue.pop());
      stackTop.unshift(this.outputQueue.pop());
      this.outputQueue.push(stackTop);
    } else {
      throw new Error(`Operator "${ stackTop.operator.symbol }" expects 2 operands, ${ this.outputQueue.length } given`);
    }
  }
}
