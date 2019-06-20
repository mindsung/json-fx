import {FxNode} from "./fx-node";
import {FxOperatorDefinition} from "../../../defs";
import {FxTokenTag} from "./fx-token-tag";

export class FxToken extends FxNode {
  operator: FxOperatorDefinition = null;

  constructor(public symbol: string = "",
              public tag: FxTokenTag = "",
              public sourceIndex: number = -1) {
    super();
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
