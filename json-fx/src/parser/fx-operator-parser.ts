import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";
import { FxOperator } from "./fx-operator";
import { FxModule } from "./fx-module";

export class FxOperatorParser extends FxParser<FxNode, void> {
  constructor(module: FxModule) {
    super(module);
  }

  evaluate(root: FxNode): void {
    // Create a working array of node info which may contain operator nodes.
    const nodeInfo: { node: FxNode, op: FxOperator }[] = [];
    root.forEachChild((index, node) => nodeInfo.push({
      node: node,
      op: node.isTagged("operator") ? this.module.getOperator(node.value) : null
    }));

    let iop: number;
    while (true) {
      // Find the next operator to by precedence and original order until there are no more operators left.
      iop = -1;
      nodeInfo.forEach((n, i) => iop = n.op != null && (iop < 0
        || (n.op.assoc === "right" && n.op.precedence >= nodeInfo[iop].op.precedence)
        || n.op.precedence > nodeInfo[iop].op.precedence) ? i : iop);
      if (iop < 0) { break; }
      // Validate the operator has both a left and right args and that neither one is another operator.
      const item = nodeInfo[iop];
      if (item.op.operandOn === "both") {
        if (iop === 0 || iop >= nodeInfo.length - 1) {
          throw new Error(`Expected left and right operands to operator "${item.op.symbol}"`);
        }
        const left = nodeInfo[iop - 1];
        const right = nodeInfo[iop + 1];
        if (left.op || right.op) {
          throw new Error(`Operator operands to "${item.op.symbol}" must be expressions.`);
        }
        // Convert the operator and args to the corresponding expression with child params.
        if (item.op.symbol === "=") {
          left.node.addChild(right.node);
          item.node.orphan();
        }
        else {
          item.node.addChild(new FxNode(null, "parameter")).addChild(left.node);
          item.node.addChild(new FxNode(null, "parameter")).addChild(right.node);
        }
        // Update the working array replacing the operator and args with the new single expression.
        nodeInfo.splice(iop - 1, 3, item);
      }
      else if (item.op.operandOn === "left") {
        if (iop === 0) {
          throw new Error(`Expected left operand to operator "${item.op.symbol}"`);
        }
        const left = nodeInfo[iop - 1];
        if (left.op) {
          throw new Error(`Operator operand to "${item.op.symbol}" must be an expression.`);
        }
        item.node.addChild(new FxNode(null, "parameter")).addChild(left.node);
        // Update the working array replacing the operator and args with the new single expression.
        nodeInfo.splice(iop - 1, 2, item);
      }
      else if (item.op.operandOn === "right") {
        if (iop >= nodeInfo.length - 1) {
          throw new Error(`Expected right operand to operator "${item.op.symbol}"`);
        }
        const right = nodeInfo[iop + 1];
        if (right.op) {
          throw new Error(`Operator operand to "${item.op.symbol}" must be an expression.`);
        }
        item.node.addChild(new FxNode(null, "parameter")).addChild(right.node);
        // Update the working array replacing the operator and args with the new single expression.
        nodeInfo.splice(iop, 2, item);
      }
      item.node.value = item.op.expr;
      item.node.removeTags();
      item.node.addTags("expression");
      item.op = null;
    }
  }
}
