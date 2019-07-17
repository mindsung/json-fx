import { FxParser } from "./model/fx-parser";
import { Tokenizer } from "./tokenizer";
import { isArray, isBoolean, isNumber, isObject, isString } from "../common";
import { Grouper } from "./grouper";
import { FxTokenNode } from "./model/fx-token-node";

export class TemplateGrouper implements FxParser<any, FxTokenNode> {

  private tokenizer: Tokenizer;
  private grouper: Grouper;

  constructor() {
    this.tokenizer = new Tokenizer();
    this.grouper = new Grouper();
  }

  parse(template: any): FxTokenNode {
    if (isString(template)) {
      return this.parseString(template);
    } else if (isNumber(template)) {
      return new FxTokenNode("numeric", template.toString(), 0);
    } else if (isBoolean(template)) {
      return new FxTokenNode("identifier", template.toString(), 0);
    } else if (template === null || template === undefined) {
      return new FxTokenNode("identifier", "null", 0);
    } else if (isArray(template)) {
      return this.parseArray(template);
    } else if (isObject(template)) {
      return this.parseObject(template);
    }
  }

  private parseString(str: string): FxTokenNode {
    const tokens = this.tokenizer.parse(str);
    const root = this.grouper.parse(tokens);

    if (root.count > 1) {
      return root;
    } else if (root.count > 0) {
      const first = root.first;
      first.orphan();
      return first;
    } else {
      return new FxTokenNode("identifier", "null");
    }
  }

  private parseArray(arr: any[]): FxTokenNode {
    const root = new FxTokenNode("array", "[]");

    for (const item of arr) {
      root.add(this.parse(item));
    }

    return root;
  }

  private parseObject(obj: any): FxTokenNode {
    const root = new FxTokenNode("object", "{}");
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key.startsWith("//")) {
        continue;
      }

      let keyToken = this.parse(key);
      keyToken.isLvalue = true;

      // TODO: Hack for optional keys (e.g. "foo?")
      if (keyToken.count == 2 && keyToken.first.tag == "identifier" && keyToken.last.symbol == "?") {
        keyToken = keyToken.first;
        keyToken.symbol += "?";
      }

      root.add(keyToken);
      root.add(new FxTokenNode("operator", ":"));
      root.add(this.parse(obj[key]));
      root.add(new FxTokenNode("operator", ","));
    }

    if (root.count > 0) {
      root.remove();
    }

    return root;
  }
}
