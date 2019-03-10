import {FxCompiler} from "./fx-parser";
import {OldExpression} from "../core/expression";
import {FxModule} from "../modules/fx-module";
import {$f} from "../core/expression-factory";
import {FxScriptCompiler} from "./fx-script-compiler";

export class FxObjectCompiler extends FxCompiler<any> {

  private scriptCompiler: FxScriptCompiler;

  constructor(module: FxModule) {
    super(module);
    this.scriptCompiler = new FxScriptCompiler(module);
  }

  evaluate(obj: any): OldExpression<any> {
    if (obj instanceof Object) {
      return this.evaluateObject(<Object>obj);
    } else {
      return this.scriptCompiler.evaluate(obj.toString());
    }
  }

  private evaluateObject(obj: object): OldExpression<any> {
    const keyValues: Array<{ key: string, value: any }> = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        keyValues.push({key: key, value: this.evaluate(obj[key])});
      }
    }

    return $f("object", ...keyValues);
  }
}
