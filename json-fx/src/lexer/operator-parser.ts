import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";


export class OperatorParser implements FxParser<FxTokenNode, void> {
  private context: FxContext;
  private nextNode: FxTokenNode;

  private operatorStack: FxTokenNode[];
  private outputQueue: FxTokenNode[];

  private lastUnary: FxTokenNode;

  constructor(context: FxContext) {
    this.context = context;
  }

  public parse(root: FxTokenNode): void {
    this.operatorStack = [];
    this.outputQueue = [];

    for (this.nextNode of root.children) {
      if (this.nextNode.tag == "operator") {
        if (this.nextNode.operator.isUnary) {
          this.lastUnary = this.nextNode;
        } else {
          while (this.operatorStack.length > 0 && this.operatorStack[0].operator.precedence >= this.nextNode.operator.precedence) {
            this.shunt();
          }
          this.operatorStack.unshift(this.nextNode);
        }
      } else {
        if (this.lastUnary) {
          this.lastUnary.add(this.nextNode);
          this.outputQueue.push(this.lastUnary);
          this.lastUnary = null;
        } else {
          this.outputQueue.push(this.nextNode);
        }
      }
    }

    while (this.operatorStack.length > 0) {
      this.shunt();
    }
  }

  private shunt(): void {
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
}
