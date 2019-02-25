import {FxParser} from "./fx-parser";
import {FxNode} from "./fx-node";
import {Expression} from "../core/expression";
import {$f, $fx, $withVars} from "../core/expression-factory";
import {$BOOKS} from "./data/books";

export class FxCompiler extends FxParser<FxNode, Expression<any>> {
  evaluate(root: FxNode): Expression<any> {
    if (root.isTagged("global")) {
      return this.evaluate(root.firstChild());
    } else if (root.isTagged("literal")) {
      return $f("const", root.value);
    } else if (root.isTagged("expression")) {
      return this.evaluateExpression(root);
    } else if (root.isTagged("identifier")) {
      return this.evaluateProperty(root.value);
    } else if (root.isTagged("parameter")) {
      return this.evaluateParameter(root);
    } else {
      return null;
    }
  }

  private evaluateExpression(node: FxNode) {
    const params: any[] = [];
    node.forEachChild((index, child) => {
      params.push(this.evaluate(child));
    });

    params.unshift(node.value);
    return $fx(...params);
  }

  private evaluateProperty(identifier: string): Expression<any> {
    const split = identifier.split(".");

    if (split.length === 1) {
      return $f("var", identifier);
    } else {
      return $fx("prop", this.evaluateProperty(split[0]), split[1]);
    }
  }

  private evaluateParameter(node: FxNode) {
    return this.evaluate(node.firstChild());
  }
}
