import { FxNode } from "./fx-node";
import { FxOperatorDefinition } from "../../../defs";
import { FxTokenTag } from "./fx-token-tag";
import { FxToken } from "./fx-token";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxEvaluatorDefinition } from "./fx-definition";
import { SourceRef } from "../../runtime/source-ref";

export class FxTokenNode extends FxNode implements FxToken {

  public tag: FxTokenTag;
  public symbol: string;
  public index: number;

  public sourceRef: SourceRef;

  public operator: FxOperatorDefinition;
  public evaluator: FxEvaluatorDefinition;
  public optimizer: (token?: FxTokenNode) => void;
  public compiler: (token: FxTokenNode) => FxExpression;

  constructor(tag?: FxTokenTag, symbol?: string, index?: number) {
    super();
    this.tag = tag || "";
    this.symbol = symbol || "";
    this.index = index != undefined ? index : -1;
  }

  private _isLvalue = false;

  public get isLvalue(): boolean {
    return this._isLvalue;
  }

  public set isLvalue(v: boolean) {
    this._isLvalue = v;
    for (const child of this.children) {
      child.isLvalue = true;
    }
  }

  public optimize(): void {
    if (this.optimizer) {
      this.optimizer.call(this.optimizer, this);
    }
  }

  public compile(): FxExpression {
    return this.compiler
      ? this.compiler(this)
      : null;
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

  public toString(): string {
    return this.toStringIndent();
  }

  private toStringIndent(indent = 0): string {
    const istr = indent > 0 ? "│ ".repeat(indent - 1) + "├─" : "";

    let result = istr + this.toStringSelf();

    if (this.count > 0) {
      result += `\n${ this.children.map(v => v.toStringIndent(indent + 1)).join("\n") }`;
    }

    return result;
  }

  private toStringSelf(): string {
    return (this.symbol != "" ? this.symbol : "<>") + ` [${ this.tag }]`;
  }
}
