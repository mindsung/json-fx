import { FxParser } from "./model/fx-parser";
import { FxToken } from "./model/fx-token";
import { FxTokenizer } from "./fx-tokenizer";
import { FxGrouper } from "./fx-grouper";
import { FxExpressionParser } from "./fx-expression-parser";
import { FxOperatorParser } from "./fx-operator-parser";
import { FxOptimizer } from "./fx-optimizer";
import { FxNodeParser } from "./fx-node-parser";
import { FxContext } from "./model/fx-context";
import { FxContextParser } from "./fx-context-parser";

export class FxScriptParser extends FxParser<string, FxToken> {
  private tokenizer: FxTokenizer;
  private grouper: FxGrouper;

  private parser: FxParser<FxToken>;

  public lvalue: boolean;

  constructor(context: FxContext) {
    super(context);

    this.tokenizer = new FxTokenizer();
    this.grouper = new FxGrouper();

    this.parser = new FxNodeParser(
      new FxExpressionParser(context),
      new FxOperatorParser(context),
      new FxOptimizer(context),
      new FxContextParser(context));
  }

  evaluate(expr: string) {
    const tokens = this.tokenizer.evaluate(expr);
    const root = this.grouper.evaluate(tokens);

    root.isLvalue = !!this.lvalue;

    this.parser.evaluate(root);
    return root.firstChild;
  }
}
