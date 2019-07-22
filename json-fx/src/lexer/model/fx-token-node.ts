import { FxNode } from "./fx-node";
import { FxTokenTag } from "./fx-token-tag";
import { FxToken } from "./fx-token";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxEvaluatorDefinition, FxOperatorDefinition } from "./fx-definition";
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

    this.sourceRef = {
      index: this.index,
      symbol: this.symbol,
      path: ""
    };
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

  public is(tag: FxTokenTag, symbol?: string): boolean {
    return this.tag == tag && (!symbol || this.symbol == symbol);
  }

  public optimize(): void {
    for (const child of this.children) {
      child.optimize();
    }

    if (this.optimizer) {
      this.optimizer.call(this.optimizer, this);
    }
  }

  public compile(): FxExpression {
    if (this.compiler) {
      return this.compiler(this);
    } else {
      throw new Error(`Token ${ this.toStringSelf() } has no compiler defined`);
    }
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
