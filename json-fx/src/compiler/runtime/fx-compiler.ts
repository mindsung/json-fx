import { FxTokenNode } from "../lexer/model/fx-token-node";
import { FxExpression } from "./model/fx-expression";
import { FxObject } from "./model/fx-object";
import { FxLambda } from "./model/fx-lambda";
import { FxVariableReference } from "./model/fx-variable-reference";
import { FxFunction } from "./model/fx-function";
import { FxConstant } from "./model/fx-constant";
import { FxArray } from "./model/fx-array";
import { FxLambdaFn } from "../../defs";
import { FxProperty, FxPropertyPathItem } from "./model/fx-property";
import { FxContext } from "../lexer/model/fx-context";
import { FxCompileError } from "../fx-error";
import { FxScopeVariable } from "./model/fx-scope-variable";

export class FxCompiler {

  private readonly context: FxContext;

  constructor(context: FxContext) {
    this.context = context;
  }

  public compile(root: FxTokenNode): FxExpression {
    const result = root.compile();
    result.sourceRef = {symbol: root.symbol, index: root.index};
    return result;
  }

  public backupCompile(root: FxTokenNode): FxExpression {
    let result: FxExpression;

    switch (root.tag) {
      case "group":
        return this.compile(root.first);
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
        result = new FxVariableReference(root.symbol);
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

    return result;
  }

  private createExpression(root: FxTokenNode) {
    const exprDef = this.context.loader.getExpression(root.symbol);

    if (!exprDef) {
      throw new FxCompileError(`Expression "${root.symbol}" is undefined`, root.index);
    }

    const result = new FxFunction(exprDef.expression);
    result.args = root.children.map(child => this.compile(child));
    result.deferEvaluation = exprDef.deferEvaluation;

    return result;
  }

  private createLambda(root: FxTokenNode) {
    return new FxLambda(this.getLambdaVarNames(root), this.compile(root.last));
  }

  private createFunction(root: FxTokenNode) {
    const result: FxExpression = new FxVariableReference(root.symbol);
    let params: FxExpression[];

    if (root.first && root.first.tag == "group") {
      params = root.first.children.map(child => this.compile(child));
    } else {
      params = root.children.map(child => this.compile(child));
    }

    return new FxFunction((lambda: FxLambdaFn, ...args: any[]) => {
      return lambda(...args);
    }, [result].concat(params));
  }

  private createObject(root: FxTokenNode) {
    const result = new FxObject();

    root.children.forEach(child => {
      if (child.tag == "identifier") {
        result.items[child.symbol] = this.compile(child.first);

      } else if (child.tag == "variable") {
        result.scope.setVariable(new FxScopeVariable(child.symbol, this.compile(child.first)));

      } else if (child.tag == "template") {
        result.scope.setVariable(new FxScopeVariable(child.symbol, this.createLambda(child), false));
      }
    });

    return result;
  }

  private getLambdaVarNames(lambda: FxTokenNode) {
    if (lambda.first.tag == "signature") {
      return lambda.first.children.map(child => child.symbol);
    } else {
      return [];
    }
  }

  private createArray(root: FxTokenNode) {
    return new FxArray(root.children.map(child => this.compile(child)));
  }

  private createConstant(symbol: string) {
    let value: any = symbol;

    if (symbol == "true") {
      value = true;
    } else if (symbol == "false") {
      value = false;
    } else if (symbol == "null") {
      value = null;
    }

    return new FxConstant(value);
  }

  private createProp(root: FxTokenNode) {
    return new FxProperty(this.getPropPath(root));
  }

  private getPropPath(root: FxTokenNode): FxPropertyPathItem[] {
    if (root.tag == "prop" || root.tag == "nullprop") {
      const last = {
        value: this.createConstant(root.last.symbol),
        interrupts: false
      };

      const path = [...this.getPropPath(root.first), last];

      if (root.tag == "nullprop") {
        path[path.length - 2].interrupts = true;
      }

      return path;

    } else {
      return [{
        value: this.compile(root),
        interrupts: false
      }];
    }
  }
}
