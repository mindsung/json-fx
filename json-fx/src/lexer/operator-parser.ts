import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";


export class OperatorParser implements FxParser<FxTokenNode, void> {
  private context: FxContext;
  private nextNode: FxTokenNode;

  private operatorStack: FxTokenNode[];
  private outputQueue: FxTokenNode[];

  constructor(context: FxContext) {
    this.context = context;
  }

  public parse(root: FxTokenNode): void {
    this.operatorStack = [];
    this.outputQueue = [];

    for (this.nextNode of root.children) {
      if (this.nextNode.tag == "operator") {
        while (this.operatorStack.length > 0 && (this.operatorStack[0].operator.precedence >= this.nextNode.operator.precedence || this.operatorStack[0].operator.isUnary)) {
          this.shunt();
        }
        this.operatorStack.unshift(this.nextNode);
      } else {
        this.outputQueue.push(this.nextNode);
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
      throw new Error(`Operator "${stackTop.operator.symbol}" expects ${numOperands} operands, ${this.outputQueue.length} given`);
    }
  }
}
