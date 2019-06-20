import {FxNode} from "./fx-node";
import {FxOperatorDefinition} from "../../../defs";
import {FxTokenTag} from "./fx-token-tag";
import {FxToken} from "./fx-token";

export class FxTokenNode extends FxNode implements FxToken {

  public symbol: string;
  public tag: FxTokenTag;
  public index: number;

  operator: FxOperatorDefinition = null;

  constructor(symbol?: string, tag?: FxTokenTag, index?: number) {
    super();

    this.symbol = symbol || "";
    this.tag = tag || "";
    this.index = index || -1;
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

  public toString() {
    return this.toStringIndent();
  }

  private toStringIndent(indent = 0) {
    const istr = indent > 0 ? "│ ".repeat(indent - 1) + "├─" : "";

    let result = istr + (`<${this.toStringSelf()}>`);

    if (this.childCount > 0) {
      result += `\n${this.children.map(v => v.toStringIndent(indent + 1)).join("\n")}`;
    }

    return result;
  }

  private toStringSelf() {
    if (this.tag !== "literal" && this.tag !== "object" && this.tag !== "group" && this.tag !== "numeric") {
      return `${this.symbol}:${this.tag}`;
    } else {
      return this.symbol;
    }
  }
}