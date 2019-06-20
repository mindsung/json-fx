import {FxNode} from "./fx-node";
import {FxOperatorDefinition} from "../../../defs";
import {FxTokenTag} from "./fx-token-tag";
import {FxToken} from "./fx-token";

export class FxTokenNode extends FxNode<FxToken> {

  operator: FxOperatorDefinition = null;

  public get symbol(): string { return this.data.symbol; }
  public set symbol(value: string) { this.data.symbol = value; }

  public get tag(): FxTokenTag { return this.data.tag; }
  public set tag(value: FxTokenTag) { this.data.tag = value; }

  public get index(): number { return this.data.index; }
  public set index(value: number) { this.data.index = value; }

  constructor(symbol?: string, tag?: FxTokenTag, index?: number) {
    super();
    this.data = {symbol: symbol || "", tag: tag || "", index: index || -1};
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
