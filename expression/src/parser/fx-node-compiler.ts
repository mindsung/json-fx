import {FxCompiler} from "./fx-parser";
import {FxNode} from "./fx-node";
import {Expression} from "../core/expression";
import {$f, $fx} from "../core/expression-factory";

export class FxNodeCompiler extends FxCompiler<FxNode> {
  evaluate(root: FxNode): Expression<any> {
    if (root.isTagged("global")) {
      return this.evaluate(root.firstChild());
    } else if (root.isTagged("literal")) {
      return $f("const", root.value);
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
    return node.value === "object" ? $f(...params) : $fx(...params);
  }

  private evaluateProperty(identifier: string): Expression<any> {
    const dotIndex = identifier.lastIndexOf(".");
    const mapIndex = identifier.lastIndexOf("~");

    const min = Math.min(dotIndex, mapIndex);
    const max = Math.max(dotIndex, mapIndex);

    if (min === -1 && max === -1) {
      return $f("var", identifier);
    } else {
      const index = min !== -1 ? min : max;
      const parent = identifier.substr(0, index);
      const child = identifier.substr(index + 1);

      if (index === dotIndex) {
        return $fx("prop", this.evaluateProperty(parent), child);
      } else {
        return $fx("map", this.evaluateProperty(parent), this.evaluateProperty("$." + child));
      }
    }
  }

  private evaluateParameter(node: FxNode) {
    if (node.isTagged("parameter")) {
      if (node.value !== null) {
        return {key: node.value, value: this.evaluate(node.firstChild())};
      } else {
        return this.evaluate(node.firstChild());
      }
    } else {
      return this.evaluate(node);
    }
  }
}
