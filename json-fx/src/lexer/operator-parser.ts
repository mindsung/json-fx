import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";

export class OperatorParser implements FxParser<FxTokenNode, void> {

  private operatorStack: FxTokenNode[];
  private outputQueue: FxTokenNode[];

  private current: FxTokenNode;
  private lastUnary: FxTokenNode;

  public parse(root: FxTokenNode): void {
    this.operatorStack = [];
    this.outputQueue = [];

    for (this.current of root.children) {
      if (this.current.tag == "operator") {
        this.parseOperator();
      } else {
        this.parseTerm();
      }
    }

    while (this.operatorStack.length > 0) {
      this.popOperator();
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
      this.lastUnary = this.current;
    }
  }

  private parseBinary(): void {
    while (this.operatorStack.length > 0 && this.operatorStack[0].operator.precedence >= this.current.operator.precedence) {
      this.popOperator();
    }
    this.operatorStack.unshift(this.current);
  }

  private popOperator(): void {
    const stackTop = this.operatorStack.shift();
    let numOperands = stackTop.operator.isUnary ? 1 : 2;

    if (this.outputQueue.length >= numOperands) {
      while (numOperands--) {
        stackTop.unshift(this.outputQueue.pop());
      }
      this.outputQueue.push(stackTop);
    } else {
      throw new Error(`Operator "${ stackTop.operator.symbol }" expects ${ numOperands } operands, ${ this.outputQueue.length } given`);
    }
  }

  private parseTerm(): void {
    if (this.lastUnary) {
      this.lastUnary.add(this.current);
      this.outputQueue.push(this.lastUnary);
      this.lastUnary = null;
    } else {
      this.outputQueue.push(this.current);
    }
  }
}
