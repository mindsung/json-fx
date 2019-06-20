import {FxParser} from "./model/fx-parser";
import {FxToken} from "./model/fx-token";


export class FxOperatorParser extends FxParser<FxToken, void> {
  private nextNode: FxToken;

  private operatorStack: FxToken[];
  private outputQueue: FxToken[];

  parse(root: FxToken) {
    this.operatorStack = [];
    this.outputQueue = [];

    for (this.nextNode of root.children) {
      this.loadOperator();

      if (this.nextNode.tag === "operator") {
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

  private loadOperator() {
    if (this.nextNode.tag === "operator") {
      this.nextNode.operator = this.context.loader.getOperator(this.nextNode.symbol);
      this.nextNode.symbol = this.nextNode.operator.symbol;
    }
  }

  private shunt() {
    const stackTop = this.operatorStack.shift();
    let numOperands = stackTop.operator.isUnary ? 1 : 2;

    if (this.outputQueue.length >= numOperands) {
      while (numOperands--) {
        stackTop.unshiftChild(this.outputQueue.pop());
      }
      this.outputQueue.push(stackTop);
    } else {
      throw new Error(`Operator "${stackTop.operator.symbol}" expects ${numOperands} operands, ${this.outputQueue.length} given`);
    }
  }
}
