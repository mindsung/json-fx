import { FxParser } from "../model/fx-parser";
import { FxTokenNode } from "./node/fx-token-node";
import { TemplateGrouper } from "./template-grouper";
import { RecursiveParser } from "./recursive-parser";
import { ExpressionParser } from "./expression-parser";
import { OperatorParser } from "./operator-parser";
import { DefinitionLoader } from "./definition-loader";
import { OperatorLoader } from "./operator-loader";
import { Loader } from "./loader";
import { FxNode } from "./node/fx-node";
import { Fx } from "../fx";

export class TemplateParser implements FxParser<any, FxTokenNode> {

  public static LogExpressions = false;

  private readonly grouper: TemplateGrouper;
  private readonly parser: RecursiveParser;

  constructor(loader: Loader) {
    this.grouper = new TemplateGrouper();

    this.parser = new RecursiveParser(
      {
        parser: new OperatorLoader(loader),
        rootFirst: true
      },
      { parser: new ExpressionParser() },
      { parser: new OperatorParser() },
      { parser: new DefinitionLoader(loader) }
    );
  }

  public parse(template: any): FxTokenNode {
    const root = this.grouper.parse(template);
    this.parser.parse(root);

    root.optimize();

    if (TemplateParser.LogExpressions) {
      console.log(root.toString(true));
    }

    root.validate();
    return root;
  }
}
