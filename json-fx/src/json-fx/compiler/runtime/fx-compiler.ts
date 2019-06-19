import { FxParser } from "../lex/model/fx-parser";
import { FxToken } from "../lex/model/fx-token";
import { FxExpression } from "./model/fx-expression";
import { FxObject } from "./model/fx-object";
import { FxLambda } from "./model/fx-lambda";
import { FxVariable } from "./model/fx-variable";
import { FxFunction } from "./model/fx-function";
import { FxConstant } from "./model/fx-constant";
import { FxArray } from "./model/fx-array";
import { FxLambdaFn } from "../../defs";
import { FxProperty, FxPropertyPathItem } from "./model/fx-property";

export class FxCompiler extends FxParser<FxToken, FxExpression> {
  evaluate(root: FxToken): FxExpression {
    let result: FxExpression;

    switch (root.tag) {
      case "global":
        return this.evaluate(root.firstChild);
      case "operator":
      case "expression":
        result = this.createExpression(root);
        break;
      case "lambda":
        result = this.createLambda(root);
        break;
      case "object":
        result = this.createObject(root);
        break;
      case "array":
        result = this.createArray(root);
        break;
      case "variable":
      case "template":
        result = new FxVariable(root.symbol);
        break;
      case "template-call":
        result = this.createFunction(root);
        break;
      case "numeric":
        result = new FxConstant(parseFloat(root.symbol));
        break;
      case "nullprop":
      case "prop":
        result = this.createProp(root);
        break;
      default:
        result = this.createConstant(root.symbol);
        break;
    }

    result.sourceRef = { symbol: root.symbol, index: root.sourceIndex };
    return result;
  }

  private createExpression(root: FxToken) {
    const exprDef = this.context.loader.getExpression(root.symbol);

    const result = new FxFunction(exprDef.expression);
    result.args = root.children.map(child => this.evaluate(child));
    result.deferEvaluation = exprDef.deferEvaluation;

    return result;
  }

  private createLambda(root: FxToken) {
    return new FxLambda(this.getLambdaVarNames(root), this.evaluate(root.lastChild));
  }

  private createFunction(root: FxToken) {
    const result: FxExpression = new FxVariable(root.symbol);
    return new FxFunction((lambda: FxLambdaFn, ...args: any[]) => {
      return lambda(...args);
    }, [result].concat(root.children.map(child => this.evaluate(child))));
  }

  private createObject(root: FxToken) {
    const result = new FxObject();

    root.children.forEach(child => {
      if (child.tag === "identifier") {
        result.items[child.symbol] = this.evaluate(child.firstChild);

      } else if (child.tag === "variable") {
        result.scope.setVariable(child.symbol, this.evaluate(child.firstChild));

      } else if (child.tag === "template") {
        result.scope.setVariable(child.symbol, this.createLambda(child));
      }
    });

    return result;
  }

  private getLambdaVarNames(lambda: FxToken) {
    return lambda.firstChild.children.map(child => child.symbol);
  }

  private createArray(root: FxToken) {
    return new FxArray(root.children.map(child => this.evaluate(child)));
  }

  private createConstant(symbol: string) {
    let value: any = symbol;

    if (symbol === "true") {
      value = true;
    } else if (symbol === "false") {
      value = false;
    } else if (symbol === "null") {
      value = null;
    }

    return new FxConstant(value);
  }

  private createProp(root: FxToken) {
    const r = new FxProperty(this.getPropPath(root));
    // console.log(r);
    return r;
  }

  private getPropPath(root: FxToken): FxPropertyPathItem[] {
    if (root.tag == "prop" || root.tag == "nullprop") {
      const last = {
        value: this.createConstant(root.lastChild.symbol),
        interrupts: false
      };

      const path = [...this.getPropPath(root.firstChild), last];

      if (root.tag == "nullprop") {
        path[path.length - 2].interrupts = true;
      }

      return path;

    } else {
      return [{
        value: this.evaluate(root),
        interrupts: false
      }];
    }
  }
}
