import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";
import {Tokenizer} from "./tokenizer";
import {Grouper} from "./grouper";
import {ExpressionParser} from "./expression-parser";
import {OperatorParser} from "./operator-parser";
import {Optimizer} from "./optimizer";
import {NodeParser} from "./node-parser";
import {FxContext} from "./model/fx-context";
import {ContextParser} from "./context-parser";

export class ScriptParser extends FxParser<string, FxTokenNode> {
  private tokenizer: Tokenizer;
  private grouper: Grouper;

  private parser: FxParser<FxTokenNode>;

  public lvalue: boolean;

  constructor(context: FxContext) {
    super(context);

    this.tokenizer = new Tokenizer();
    this.grouper = new Grouper();

    this.parser = new NodeParser(
      new ExpressionParser(context),
      new OperatorParser(context),
      new Optimizer(context),
      new ContextParser(context));
  }

  parse(expr: string) {
    let tokens = this.tokenizer.parse(expr);
    // TODO: This is temporary and really ugly and bad code to handle the special case of an "optional" object key.
    // TODO: Create a separate parser for left values that better handles this case.
    if (this.lvalue && tokens.length == 2 && tokens[0].tag == "identifier"
      && tokens[1].tag == "operator" && tokens[1].symbol == "?") {
      tokens[0].symbol = tokens[0].symbol + "?";
      tokens = [tokens[0]];
    }
    const root = this.grouper.parse(tokens);

    root.isLvalue = !!this.lvalue;

    this.parser.parse(root);
    return root.first;
  }
}
