import {FxCompiler} from "./fx-parser";
import {OldExpression} from "../core/expression";
import {FxModule} from "../modules/fx-module";
import {FxTokenizer} from "./fx-tokenizer";
import {FxGrouper} from "./fx-grouper";
import {FxNodeParser} from "./fx-node-parser";
import {FxNodeCompiler} from "./fx-node-compiler";
import {FxExpressionParser} from "./fx-expression-parser";
import {FxOperatorParser} from "./fx-operator-parser";
import {FxOptimizer} from "./fx-optimizer";

export class FxScriptCompiler extends FxCompiler<string> {

  private tokenizer: FxTokenizer;
  private grouper: FxGrouper;
  private parser: FxNodeParser;
  private compiler: FxNodeCompiler;

  constructor(public module: FxModule) {
    super(module);

    this.tokenizer = new FxTokenizer();
    this.grouper = new FxGrouper();

    this.parser = new FxNodeParser(module,
      new FxExpressionParser(module),
      new FxOperatorParser(module),
      new FxOptimizer(module));

    this.compiler = new FxNodeCompiler(module);
  }

  evaluate(expr: string): OldExpression<any> {
    const tokens = this.tokenizer.evaluate(expr);
    const root = this.grouper.evaluate(tokens);

    this.parser.evaluate(root);
    return this.compiler.evaluate(root);
  }
}
