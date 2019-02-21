import {FxNode} from "./fx-node";
import {FxParser} from "./fx-parser";
import {FxOperator} from "./fx-operator";
import {FxModule} from "../modules/fx-module";

interface OpNode {
  node: FxNode;
  op: FxOperator;
}

export class FxOperatorParser extends FxParser<FxNode, void> {
  constructor(module: FxModule) {
    super(module);
  }

  private static shiftOperatorStack(operatorStack: Array<OpNode>, terms: Array<FxNode>) {
    const item = operatorStack.shift();

    if (terms.length !== 2) {
      throw new Error(`Expected two arguments to operator "${item.op.symbol}"`);
    }

    if (item.op.symbol === "=") {
      terms.shift().addChild(terms.shift());
      item.node.orphan();
    } else {
      for (let i = 0; i < 2; i++) {
        const param = new FxNode("@param", "parameter");
        item.node.addChild(param).addChild(terms.shift());
      }
    }

    item.node.value = item.op.expr;
    item.node.removeTags();
    item.node.addTags("expression");

    terms.push(item.node);
  }

  evaluate(root: FxNode): void {
    const operatorStack: Array<OpNode> = [];
    const terms: FxNode[] = [];

    root.forEachChild((index, node) => {
      if (node.isTagged("operator")) {
        const op = this.module.getOperator(node.value) || new FxOperator(node.value, ":undefined", 99);

        while (operatorStack.length > 0 && operatorStack[0].op.precedence > op.precedence) {
          FxOperatorParser.shiftOperatorStack(operatorStack, terms);
        }

        operatorStack.unshift({node: node, op: op});
      } else {
        terms.push(node);
      }
    });

    while (operatorStack.length > 0) {
      FxOperatorParser.shiftOperatorStack(operatorStack, terms);
    }
  }
}
