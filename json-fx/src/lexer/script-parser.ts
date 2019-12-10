import { RecursiveParser } from "./recursive-parser";
import { TemplateGrouper } from "./template-grouper";
import { OperatorLoader } from "./operator-loader";
import { ExpressionParser } from "./expression-parser";
import { OperatorParser } from "./operator-parser";
import { DefinitionLoader } from "./definition-loader";
import { Loader } from "./loader";

export class ScriptParser extends RecursiveParser {

  public constructor(loader: Loader) {
    super(
      {
        parser: new OperatorLoader(loader),
        rootFirst: true
      },
      { parser: new ExpressionParser() },
      { parser: new OperatorParser() },
      { parser: new DefinitionLoader(loader) }
    );
  }
}
