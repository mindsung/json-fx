import { FxParser } from "../model/fx-parser";
import { FxTokenNode } from "./node/fx-token-node";
import { TemplateGrouper } from "./template-grouper";
import { RecursiveParser } from "./recursive-parser";
import { ExpressionParser } from "./expression-parser";
import { OperatorParser } from "./operator-parser";
import { DefinitionLoader } from "./definition-loader";
import { OperatorLoader } from "./operator-loader";
import { Loader } from "./loader";

export class TemplateParser implements FxParser<any, FxTokenNode> {

  public static logExpressions = false;

  private grouper: TemplateGrouper;
  private parser: RecursiveParser;

  constructor(loader: Loader) {
    this.grouper = new TemplateGrouper();
    this.parser = new RecursiveParser(
      new OperatorLoader(loader),
      new ExpressionParser(),
      new OperatorParser(),
      new DefinitionLoader(loader),
    );
  }

  public parse(template: any): FxTokenNode {
    const root = this.grouper.parse(template);
    this.parser.parse(root);

    root.optimize();
    if (TemplateParser.logExpressions) {
      console.log(root.toString(true));
    }

    root.validate();

    return root;
  }
}
