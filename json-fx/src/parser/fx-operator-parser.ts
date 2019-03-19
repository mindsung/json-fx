import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";
import { FxOperator } from "./fx-operator";
import { FxModule } from "./fx-module";

interface OpNode {
  node: FxNode;
  op: FxOperator;
}

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
    let hadOps = false; // Only for debug logging, can be removed with log statements.
    while (true) {
      // Find the next operator to by precedence and original order until there are no more operators left.
      iop = -1;
      nodeInfo.forEach((n, i) => iop = n.op != null && (iop < 0
        || (n.op.assoc === "right" && n.op.precedence >= nodeInfo[iop].op.precedence)
        || n.op.precedence > nodeInfo[iop].op.precedence) ? i : iop);
      // if (iop < 0) { break; }
      if (iop < 0) {
        if (hadOps) { console.log("post-ops", root.toString()); }
        break;
      }
      else if (!hadOps) {
        hadOps = true;
        console.log("pre-ops", root.toString());
      }
      // Validate the operator has both a left and right args and that neither one is another operator.
      const item = nodeInfo[iop];
      if (iop === 0 || iop >= nodeInfo.length - 1) {
        throw new Error(`Expected left and right arguments to operator "${item.op.symbol}"`);
      }
      const left = nodeInfo[iop - 1];
      const right = nodeInfo[iop + 1];
      if (left.op || right.op) {
        throw new Error(`Left and right arguments to operator "${item.op.symbol}" must be expressions.`);
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
      item.node.value = item.op.expr;
      item.node.removeTags();
      item.node.addTags("expression");
      item.op = null;
      // Update the working array replacing the operator and args with the new single expression.
      nodeInfo.splice(iop - 1, 3, item);
    }
  }

  private static _shiftOperatorStack(operatorStack: Array<OpNode>, terms: Array<FxNode>) {
    const item = operatorStack.shift();

    if (terms.length !== 2) {
      throw new Error(`Expected two arguments to operator "${item.op.symbol}"`);
    }

    if (item.op.symbol === "=") {
      terms.shift().addChild(terms.shift());
      item.node.orphan();
    } else {
      for (let i = 0; i < 2; i++) {
        const param = new FxNode(null, "parameter");
        item.node.addChild(param).addChild(terms.shift());
      }
    }

    item.node.value = item.op.expr;
    item.node.removeTags();
    item.node.addTags("expression");

    terms.push(item.node);
  }

  _evaluate(root: FxNode): void {
    const operatorStack: Array<OpNode> = [];
    const terms: FxNode[] = [];

    console.log("pre-ops", root.toString());

    root.forEachChild((index, node) => {
      if (node.isTagged("operator")) {
        const op = this.module.getOperator(node.value) || new FxOperator(node.value, ":undefined", 99);

        while (operatorStack.length > 0 && operatorStack[0].op.precedence > op.precedence) {
          FxOperatorParser._shiftOperatorStack(operatorStack, terms);
        }

        operatorStack.unshift({ node: node, op: op });
      } else {
        terms.push(node);
      }
    });

    while (operatorStack.length > 0) {
      FxOperatorParser._shiftOperatorStack(operatorStack, terms);
    }

    console.log("post-ops", root.toString());
  }
}
