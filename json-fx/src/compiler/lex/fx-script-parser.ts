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
    let tokens = this.tokenizer.evaluate(expr);
    // TODO: This is temporary and really ugly and bad code to handle the special case of an "optional" object key.
    // TODO: Create a separate parser for left values that better handles this case.
    if (this.lvalue && tokens.length == 2 && tokens[0].tag === "identifier"
      && tokens[1].tag === "operator" && tokens[1].symbol === "?") {
      tokens[0].symbol = tokens[0].symbol + "?";
      tokens = [ tokens[0] ];
    }
    const root = this.grouper.evaluate(tokens);

    root.isLvalue = !!this.lvalue;

    this.parser.evaluate(root);
    return root.firstChild;
  }
}
