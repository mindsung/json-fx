import { FxCompiler } from "./fx-parser";
import { FxModule } from "./fx-module";
import { FxScriptCompiler } from "./fx-script-compiler";
import { ExpressionScope } from "../core/expression";
import { createExpressionConstant } from "../expressions";

export class FxObjectCompiler extends FxCompiler<any> {

  private scriptCompiler: FxScriptCompiler;

  constructor(module: FxModule = new FxModule()) {
    super(module);
    this.scriptCompiler = new FxScriptCompiler(module);
  }

  evaluate(obj: any): ExpressionScope<any> {
    if (obj instanceof Object) {
      return this.evaluateObject(<Object>obj);
    } else {
      return this.scriptCompiler.evaluate(obj.toString());
    }
  }

  private evaluateObject(obj: object): ExpressionScope<any> {
    const keyValues = new Map<ExpressionScope<string>, ExpressionScope>();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        keyValues.set(createExpressionConstant(key), this.evaluate(obj[key]));
      }
    }

    return this.module.exprSet.createExpressionScope("_object", [createExpressionConstant(keyValues)]);
  }
}
