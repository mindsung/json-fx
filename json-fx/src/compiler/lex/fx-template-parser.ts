import {FxParser} from "./model/fx-parser";
import {FxToken} from "./model/fx-token";
import {FxScriptParser} from "./fx-script-parser";
import {isArray, isObject, isString} from "../../common";
import {FxContext} from "./model/fx-context";

export class FxTemplateParser extends FxParser<any, FxToken> {
  private scriptParser: FxScriptParser;

  constructor(context: FxContext) {
    super(context);
    this.scriptParser = new FxScriptParser(context);
  }

  parse(expr: any): FxToken {
    if (isString(expr)) {
      return this.parseScript(expr);
    } else if (isArray(expr)) {
      return this.parseArray(expr);
    } else if (isObject(expr)) {
      return this.parseObject(expr);
    } else {
      return null;
    }
  }

  private parseScript(expr) {
    this.scriptParser.lvalue = false;
    return this.scriptParser.parse(expr);
  }

  private parseObject(expr) {
    const root = new FxToken("{}", "object", -1);

    for (const key of Object.keys(expr)) {
      if (key.startsWith("//")) {
        continue;
      }

      const child = this.parseKeyValue(key, expr[key]);
      if (child) {
        root.pushChild(child);
      }
    }

    return root;
  }

  private parseArray(expr) {
    const root = new FxToken("[]", "array", -1);

    for (const item of expr) {
      root.pushChild(this.parse(item));
    }

    return root;
  }

  parseKeyValue(key: string, value: any) {
    this.scriptParser.lvalue = true;
    const lvalue = this.scriptParser.parse(key);

    if (lvalue.childCount > 0) {
      const group = new FxToken("vars", "group", -1);
      lvalue.transferChildrenTo(group);
      lvalue.pushChild(group);
    }

    const rvalue = this.parse(value);
    lvalue.pushChild(rvalue);

    return lvalue;
  }
}
