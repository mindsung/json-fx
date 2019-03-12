import { FxCompiler } from "./fx-parser";
import { FxNode } from "./fx-node";
import { ExpressionScope } from "../core/expression";
import { createExpressionConstant } from "../expressions";

export class FxNodeCompiler extends FxCompiler<FxNode> {
  evaluate(root: FxNode): ExpressionScope<any> {
    if (root.isTagged("global")) {
      return this.evaluate(root.firstChild());
    } else if (root.isTagged("literal")) {
      return createExpressionConstant(root.value);
    } else if (root.isTagged("expression")) {
      return this.evaluateExpression(root);
    } else if (root.isTagged("identifier")) {
      return this.evaluateProperty(root.value);
    } else {
      return null;
    }
  }

  private evaluateExpression(node: FxNode) {
    const params: any[] = [];
    node.forEachChild((index, child) => {
      params.push(this.evaluateParameter(child));
    });

    params.unshift(node.value);

    // if (node.count() > 0 && !node.firstChild().isTagged("parameter")) {
    //   return $fx(...params);
    // } else {
    //   return $f(...params);
    // }

    return this.module.exprSet.createExpressionScope(params[0], params.slice(1));
  }

  private evaluateProperty(identifier: string): ExpressionScope<any> {
    const dotIndex = identifier.lastIndexOf(".");
    const mapIndex = identifier.lastIndexOf("~");

    const min = Math.min(dotIndex, mapIndex);
    const max = Math.max(dotIndex, mapIndex);

    if (min === -1 && max === -1) {
      return this.module.exprSet.createExpressionScope("_var", [createExpressionConstant(identifier)]);
    } else {
      const index = min !== -1 ? min : max;
      const parent = identifier.substr(0, index);
      const child = identifier.substr(index + 1);

      if (index === dotIndex) {
        return this.module.exprSet.createExpressionScope("_prop", [this.evaluateProperty(parent), createExpressionConstant(child)]);
      } else {
        return this.module.exprSet.createExpressionScope("map", [this.evaluateProperty(parent), this.evaluateProperty("$." + child)]);
      }
    }
  }

  private evaluateParameter(node: FxNode) {
    if (node.isTagged("parameter")) {
      if (node.value !== null) {
        return { key: node.value, value: this.evaluate(node.firstChild()) };
      } else {
        return this.evaluate(node.firstChild());
      }
    } else {
      return this.evaluate(node);
    }
  }
}
