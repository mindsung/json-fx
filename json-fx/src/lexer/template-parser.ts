import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";
import { TemplateGrouper } from "./template-grouper";
import { RecursiveParser } from "./recursive-parser";
import { ExpressionParser } from "./expression-parser";
import { OperatorParser } from "./operator-parser";
import { DefinitionLoader } from "./definition-loader";
import { OperatorLoader } from "./operator-loader";

export class TemplateParser implements FxParser<any, FxTokenNode> {

  private grouper: TemplateGrouper;
  private parser: RecursiveParser;

  constructor(context: FxContext) {
    this.grouper = new TemplateGrouper();
    this.parser = new RecursiveParser(
      new OperatorLoader(context.loader),
      new ExpressionParser(),
      new OperatorParser(),
      new DefinitionLoader(context.loader),
    );
  }

  parse(template: any): FxTokenNode {
    const root = this.grouper.parse(template);

    this.parser.parse(root);
    root.optimize();

    return root;
  }
}
