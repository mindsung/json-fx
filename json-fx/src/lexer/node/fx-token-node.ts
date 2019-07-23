import { FxNode } from "./fx-node";
import { FxTokenTag } from "../../model/fx-token-tag";
import { FxToken } from "../../model/fx-token";
import { FxExpression } from "../../runtime/fx-expression";
import { FxDefinition, FxEvaluatorDefinition, FxOperatorDefinition } from "../../model/fx-definition";
import { SourceRef } from "../../model/source-ref";

export class FxTokenNode extends FxNode implements FxToken {

  public tag: FxTokenTag;
  public symbol: string;
  public sourceRef: SourceRef;
  public definition: FxDefinition;

  constructor(tag?: FxTokenTag, symbol?: string, index?: number) {
    super();
    this.tag = tag || "";
    this.symbol = symbol || "";
    this.sourceRef = { index: index, symbol: this.symbol, path: "" };
    this.definition = {};
  }

  public get operator(): FxOperatorDefinition {
    return this.definition.operator || null;
  }

  public set operator(operator: FxOperatorDefinition) {
    this.definition.operator = operator;
  }

  public get evaluator(): FxEvaluatorDefinition {
    return this.definition.evaluator || null;
  }

  public set evaluator(evaluator: FxEvaluatorDefinition) {
    this.definition.evaluator = evaluator;
  }

  public is(tag: FxTokenTag, symbol?: string): boolean {
    return this.tag == tag && (!symbol || this.symbol == symbol);
  }

  public optimize(): void {
    for (const child of this.children) {
      child.optimize();
    }

    if (this.definition.optimizer) {
      this.definition.optimizer(this);
    }
  }

  public compile(): FxExpression {
    if (this.definition.compiler) {
      return this.definition.compiler(this);
    } else {
      throw new Error(`Token ${ this.toString() } has no compiler defined`);
    }
  }

  public static from(token: FxToken): FxTokenNode {
    const rootNode = new FxTokenNode(token.tag, token.symbol, token.index);

    if (token.children) {
      for (const child of token.children) {
        rootNode.add(FxTokenNode.from(child));
      }
    }

    return rootNode;
  }

  public toString(recursive?: boolean, indent?: number): string {
    recursive = recursive != undefined ? recursive : true;
    indent = indent != undefined ? indent : 0;

    let result = (this.symbol != "" ? this.symbol : "<>") + ` [${ this.tag }]`;

    if (recursive) {
      const indentStr = indent > 0 ? "│ ".repeat(indent - 1) + "├─" : "";
      result = indentStr + result;

      if (this.count > 0) {
        result += "\n" + this.children.map(v => v.toString(true, indent + 1)).join("\n");
      }
    }

    return result;
  }
}
