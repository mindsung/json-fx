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

    } else if (root.isTaggedAny("operator", "expression")) {
      return this.evaluateExpression(root);

    } else if (root.isTagged("identifier")) {
      return this.evaluateIdentifier(root);

    } else {
      return null;
    }
  }

  private evaluateExpression(node: FxNode) {
    const params: any[] = [];
    node.forEachChild(child => {
      params.push(this.evaluate(child));
    });

    return this.module.createScope(node.value).withParams(params);
  }

  private evaluateIdentifier(node: FxNode) {
    if (node.value.startsWith("$")) {
      return this.module.createScope("_var").withParams([createExpressionConstant(node.value)]);
    } else {
      return createExpressionConstant(FxNodeCompiler.parseConstant(node.value));
    }
  }

  private static parseConstant(identifier: string) {
    const s = identifier;
    if (s.toLowerCase() === "null") {
      return null;
    }
    if (s.toLowerCase() === "true") {
      return true;
    }
    if (s.toLowerCase() === "false") {
      return false;
    }

    const n = Number(s);
    if (!isNaN(n)) {
      return n;
    }

    const d = Date.parse(s);
    if (!isNaN(d)) {
      if (s.indexOf(":") >= 0) {
        // Has a time component, take as is.
        return new Date(d);
      }
      // No time component, interpret as date in local time by add time component 00:00
      return new Date(Date.parse(s + "T00:00"));
    }
    return s;
  }
}
