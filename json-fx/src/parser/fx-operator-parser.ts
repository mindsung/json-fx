import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";
import { Operator } from "../core/operator";

interface OperatorNode {
  op: Operator;
  node: FxNode;
}

export class FxOperatorParser extends FxParser<FxNode, void> {
  evaluate(root: FxNode): void {
    // This is based on Dijkstra's Shunting Yard Algorithm

    const operatorStack: OperatorNode[] = [];
    const outputQueue: OperatorNode[] = [];

    root.forEachChild(node => {
      const opNode = this.toOperatorNode(node);

      if (opNode.op !== null) {
        while (operatorStack.length > 0 && (operatorStack[0].op.precedence > opNode.op.precedence || operatorStack[0].op.isUnary)) {
          FxOperatorParser.shunt(operatorStack, outputQueue);
        }
        operatorStack.unshift(opNode);
      } else {
        outputQueue.push(opNode);
      }
    });

    while (operatorStack.length > 0) {
      FxOperatorParser.shunt(operatorStack, outputQueue);
    }
  }

  private toOperatorNode(node: FxNode): OperatorNode {
    let op: Operator = null;

    if (node.isTagged("operator")) {
      const expression = this.module.getOperator(node.value);

      if (!expression) {
        throw new Error(`Operator "${node.value}" is not defined`);
      }

      node.value = expression.key;
      op = expression.operator;
    }

    return { op: op, node: node };
  }

  private static shunt(stack: OperatorNode[], queue: OperatorNode[]) {
    const stackOpNode = stack.shift();
    let numOperands = stackOpNode.op.isUnary ? 1 : 2;

    if (queue.length >= numOperands) {
      while (numOperands--) {
        stackOpNode.node.addChild(queue.pop().node, true);
      }
      queue.push(stackOpNode);
    } else {
      throw new Error(`Operator "${stackOpNode.op.key}" expects ${numOperands} operands, but ${queue.length} are given`);
    }
  }
}
