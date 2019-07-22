import { FxParser } from "./model/fx-parser";
import { Tokenizer } from "./tokenizer";
import { isArray, isBoolean, isNumber, isObject, isString } from "../common";
import { Grouper } from "./grouper";
import { FxTokenNode } from "./model/fx-token-node";

export class TemplateGrouper implements FxParser<any, FxTokenNode> {

  private tokenizer: Tokenizer;
  private grouper: Grouper;

  private path: (string | number)[];

  constructor() {
    this.tokenizer = new Tokenizer();
    this.grouper = new Grouper();

    this.path = [];
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

    this.grouper.path = this.composePath();
    let root = this.grouper.parse(tokens);

    if (root.count == 1) {
      root = root.first;
      root.orphan();
    } else if (root.count == 0) {
      root = new FxTokenNode("identifier", "null");
    }

    return root;
  }

  private parseArray(arr: any[]): FxTokenNode {
    const root = this.setPath(new FxTokenNode("array", "[]"));

    for (let i = 0; i < arr.length; i++) {
      this.path.push(i);
      root.add(this.parse(arr[i]));
      this.path.pop();
    }

    return root;
  }

  private parseObject(obj: any): FxTokenNode {
    const root = this.setPath(new FxTokenNode("object", "{}"));
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


      root.add(this.setPath(new FxTokenNode("operator", ":a")));

      this.path.push(key);
      root.add(this.parse(obj[key]));
      this.path.pop();

      root.add(this.setPath(new FxTokenNode("operator", ",")));

    }

    if (root.count > 0) {
      root.remove();
    }

    return root;
  }

  private setPath(token: FxTokenNode): FxTokenNode {
    token.sourceRef.path = this.composePath();
    return token;
  }

  private composePath(): string {
    let result = "";

    for (let i = 0; i < this.path.length; i++) {
      const p = this.path[i];
      if (isString(p)) {
        result += result ? "." + p : p;
      } else if (isNumber(p)) {
        result += `[${ p }]`;
      }
    }

    return result;
  }
}
