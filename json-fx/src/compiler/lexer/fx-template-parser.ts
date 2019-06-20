import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";
import {FxScriptParser} from "./fx-script-parser";
import {isArray, isObject, isString} from "../../common";
import {FxContext} from "./model/fx-context";

export class FxTemplateParser extends FxParser<any, FxTokenNode> {
  private scriptParser: FxScriptParser;

  constructor(context: FxContext) {
    super(context);
    this.scriptParser = new FxScriptParser(context);
  }

  parse(expr: any): FxTokenNode {
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
    const root = new FxTokenNode("{}", "object", -1);

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
    const root = new FxTokenNode("[]", "array", -1);

    for (const item of expr) {
      root.pushChild(this.parse(item));
    }

    return root;
  }

  parseKeyValue(key: string, value: any) {
    this.scriptParser.lvalue = true;
    const lvalue = this.scriptParser.parse(key);

    if (lvalue.childCount > 0) {
      const group = new FxTokenNode("vars", "group", -1);
      lvalue.transferChildrenTo(group);
      lvalue.pushChild(group);
    }

    const rvalue = this.parse(value);
    lvalue.pushChild(rvalue);

    return lvalue;
  }
}
