import {FxNode} from "./fx-node";
import {FxOperatorDefinition} from "../../../defs";
import {FxTokenTag} from "./fx-token-tag";
import {FxToken} from "./fx-token";

export class FxTokenNode extends FxNode implements FxToken {

  public tag: FxTokenTag;
  public symbol: string;
  public index: number;

  operator: FxOperatorDefinition = null;

  constructor(tag?: FxTokenTag, symbol?: string, index?: number) {
    super();
    this.tag = tag || "";
    this.symbol = symbol || "";
    this.index = index != undefined ? index : -1;
  }

  private _isLvalue = false;

  public get isLvalue() {
    if (this._isLvalue) {
      return true;
    } else if (this.parent) {
      return this.parent.isLvalue;
    } else {
      return false;
    }
  }

  public set isLvalue(v: boolean) {
    this._isLvalue = v;
  }

  public static from(root: FxToken): FxTokenNode {
    const rootNode = new FxTokenNode(root.tag, root.symbol, root.index);

    if (root.children) {
      for (const child of root.children) {
        rootNode.add(FxTokenNode.from(child));
      }
    }

    return rootNode;
  }

  public toString() {
    return this.toStringIndent();
  }

  private toStringIndent(indent = 0) {
    const istr = indent > 0 ? "│ ".repeat(indent - 1) + "├─" : "";

    let result = istr + (`<${this.toStringSelf()}>`);

    if (this.count > 0) {
      result += `\n${this.children.map(v => v.toStringIndent(indent + 1)).join("\n")}`;
    }

    return result;
  }

  private toStringSelf() {
    return `${this.symbol}:${this.tag}`;

    // if (this.tag != "literal" && this.tag != "object" && this.tag != "group" && this.tag != "numeric") {
    //   return `${this.symbol}:${this.tag}`;
    // } else {
    //   return this.symbol;
    // }
  }
}
