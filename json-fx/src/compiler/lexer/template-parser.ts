import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";
import { TemplateGrouper } from "./template-grouper";
import { NodeParser } from "./node-parser";
import { ExpressionParser } from "./expression-parser";
import { OperatorParser } from "./operator-parser";
import { Optimizer } from "./optimizer";
import { ContextParser } from "./context-parser";
import { OperatorContextParser } from "./operator-context-parser";

export class TemplateParser implements FxParser<any, FxTokenNode> {

  private grouper: TemplateGrouper;
  private parser: NodeParser;

  constructor(context: FxContext) {
    this.grouper = new TemplateGrouper();
    this.parser = new NodeParser(
      new ExpressionParser(),
      new OperatorContextParser(context),
      new OperatorParser(context),
      new Optimizer(),
      new ContextParser());
  }

  parse(template: any): FxTokenNode {
    const root = this.grouper.parse(template);
    this.parser.parse(root);
    return root;
  }
}
