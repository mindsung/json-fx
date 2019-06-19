import { FxParser } from "./model/fx-parser";
import { FxToken } from "./model/fx-token";
import { FxScriptParser } from "./fx-script-parser";
import { isArray, isObject, isString } from "../../common";
import { FxContext } from "./model/fx-context";

export class FxObjectParser extends FxParser<any, FxToken> {
  private scriptParser: FxScriptParser;

  constructor(context: FxContext) {
    super(context);
    this.scriptParser = new FxScriptParser(context);
  }

  evaluate(expr: any): FxToken {
    if (isString(expr)) {
      return this.evaluateScript(expr);
    } else if (isArray(expr)) {
      return this.evaluateArray(expr);
    } else if (isObject(expr)) {
      return this.evaluateObject(expr);
    } else {
      return null;
    }
  }

  private evaluateScript(expr) {
    this.scriptParser.lvalue = false;
    return this.scriptParser.evaluate(expr);
  }

  private evaluateObject(expr) {
    const root = new FxToken("{}", -1, "object");

    for (const key of Object.keys(expr)) {
      if (key.startsWith("//")) {
        continue;
      }

      const child = this.evaluateKeyValue(key, expr[key]);
      if (child) {
        root.pushChild(child);
      }
    }

    return root;
  }

  private evaluateArray(expr) {
    const root = new FxToken("[]", -1, "array");

    for (const item of expr) {
      root.pushChild(this.evaluate(item));
    }

    return root;
  }

  evaluateKeyValue(key: string, value: any) {
    this.scriptParser.lvalue = true;
    const lvalue = this.scriptParser.evaluate(key);

    if (lvalue.childCount > 0) {
      const group = new FxToken("vars", -1, "group");
      lvalue.transferChildrenTo(group);
      lvalue.pushChild(group);
    }

    const rvalue = this.evaluate(value);
    lvalue.pushChild(rvalue);

    return lvalue;
  }
}
