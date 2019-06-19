import { FxCompiler } from "./fx-parser";
import { FxModule } from "../core/fx-module";
import { FxTokenizer } from "./fx-tokenizer";
import { FxGrouper } from "./fx-grouper";
import { FxNodeParser } from "./fx-node-parser";
import { FxNodeCompiler } from "./fx-node-compiler";
import { FxExpressionParser } from "./fx-expression-parser";
import { FxOperatorParser } from "./fx-operator-parser";
import { FxOptimizer } from "./fx-optimizer";
import { ExpressionScope } from "../core/expression";
import { FxDelimiterParser } from "./fx-delimiter-parser";

export class FxScriptCompiler extends FxCompiler<string> {

  private tokenizer: FxTokenizer;
  private grouper: FxGrouper;
  private parser: FxNodeParser;
  private compiler: FxNodeCompiler;

  constructor(public module: FxModule) {
    super(module);

    this.tokenizer = new FxTokenizer(module);
    this.grouper = new FxGrouper(module);

    this.parser = new FxNodeParser(module,
      new FxDelimiterParser(module),
      new FxExpressionParser(module),
      new FxOperatorParser(module),
      new FxOptimizer(module));

    this.compiler = new FxNodeCompiler(module);
  }

  evaluate(expr: string): ExpressionScope<any> {
    const tokens = this.tokenizer.evaluate(expr);

    // console.log(tokens);

    const root = this.grouper.evaluate(tokens);

    this.parser.evaluate(root);

    // console.log(root);

    return this.compiler.evaluate(root);
  }
}
