import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";
import { TemplateGrouper } from "./template-grouper";
import { RecursiveParser } from "./recursive-parser";
import { ExpressionParser } from "./expression-parser";
import { OperatorParser } from "./operator-parser";
import { DefinitionParser } from "./definition-parser";

export class TemplateParser implements FxParser<any, FxTokenNode> {

  private grouper: TemplateGrouper;
  private parser: RecursiveParser;

  constructor(context: FxContext) {
    this.grouper = new TemplateGrouper();
    this.parser = new RecursiveParser(
      new DefinitionParser(context.loader),
      new ExpressionParser(context.loader),
      new OperatorParser(),
    );
  }

  parse(template: any): FxTokenNode {
    const root = this.grouper.parse(template);

    this.parser.parse(root);
    root.optimize();

    return root;
  }
}
