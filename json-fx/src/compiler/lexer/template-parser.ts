import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";
import {ScriptParser} from "./script-parser";
import {isArray, isObject, isString} from "../../common";
import {FxContext} from "./model/fx-context";

export class TemplateParser extends FxParser<any, FxTokenNode> {
  private scriptParser: ScriptParser;

  constructor(context: FxContext) {
    super(context);
    this.scriptParser = new ScriptParser(context);
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
    const root = new FxTokenNode("object", "{}");

    for (const key of Object.keys(expr)) {
      if (key.startsWith("//")) {
        continue;
      }

      const child = this.parseKeyValue(key, expr[key]);
      if (child) {
        root.add(child);
      }
    }

    return root;
  }

  private parseArray(expr) {
    const root = new FxTokenNode("array", "[]");

    for (const item of expr) {
      root.add(this.parse(item));
    }

    return root;
  }

  parseKeyValue(key: string, value: any) {
    this.scriptParser.lvalue = true;
    const lvalue = this.scriptParser.parse(key);

    if (lvalue.count > 0) {
      const group = new FxTokenNode("group");

      while (lvalue.count) {
        group.add(lvalue.last, 0);
      }

      lvalue.add(group);
    }

    const rvalue = this.parse(value);
    lvalue.add(rvalue);

    return lvalue;
  }
}
