import {PxNode} from "./px-node";
import {PxParser} from "./px-parser";
import {PxOperator} from "./px-operator";

interface OpNode {
  node: PxNode;
  op: PxOperator;
}

export class PxOperatorParser implements PxParser<PxNode, void> {
  private static operators = {
    "=": new PxOperator("=", ":set", 0),

    "&&": new PxOperator("&&", ":and", 1),
    "||": new PxOperator("||", ":or", 1),

    "==": new PxOperator("==", ":equalTo", 2),
    "!=": new PxOperator("!=", ":notEqualTo", 2),
    "<": new PxOperator("<", ":lessThan", 2),
    "<=": new PxOperator("<=", ":lessThanOrEqualTo", 2),
    ">": new PxOperator(">", ":greaterThan", 2),
    ">=": new PxOperator(">=", ":greaterThanOrEqualTo", 2),

    "+": new PxOperator("+", ":add", 3),
    "-": new PxOperator("-", ":sub", 3),

    "*": new PxOperator("*", ":mul", 4),
    "/": new PxOperator("/", ":div", 4)
  };

  private static shiftOperatorStack(operatorStack: Array<OpNode>, terms: Array<PxNode>) {
    const item = operatorStack.shift();

    if (terms.length !== 2) {
      throw new Error(`Expected two arguments to operator "${item.op.symbol}"`);
    }

    if (item.op.symbol === "=") {
      terms.shift().addChild(terms.shift());
      item.node.orphan();
    } else {
      for (let i = 0; i < 2; i++) {
        const param = new PxNode("@param", "parameter");
        item.node.addChild(param).addChild(terms.shift());
      }
    }

    item.node.value = item.op.expr;
    item.node.removeTags();
    item.node.addTags("expression");

    terms.push(item.node);
  }

  evaluate(root: PxNode): void {
    const operatorStack: Array<OpNode> = [];
    const terms: PxNode[] = [];

    root.forEachChild((index, node) => {
      if (node.isTagged("operator")) {
        const op = PxOperatorParser.operators[node.value] || new PxOperator(node.value, ":undefined", 99);

        while (operatorStack.length > 0 && operatorStack[0].op.precedence > op.precedence) {
          PxOperatorParser.shiftOperatorStack(operatorStack, terms);
        }

        operatorStack.unshift({node: node, op: op});
      } else {
        terms.push(node);
      }
    });

    while (operatorStack.length > 0) {
      PxOperatorParser.shiftOperatorStack(operatorStack, terms);
    }
  }
}
