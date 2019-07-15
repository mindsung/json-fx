import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";
import { TemplateGrouper } from "./template-grouper";
import { NodeParser } from "./node-parser";
import { ExpressionParser } from "./expression-parser";
import { OperatorParser } from "./operator-parser";
import { Optimizer } from "./optimizer";
import { ContextParser } from "./context-parser";
import { OperatorContextParser } from "./operator-context-parser";
import { FxNode } from "./model/fx-node";
import { FxCompiler } from "../runtime/fx-compiler";

export class TemplateParser implements FxParser<any, FxTokenNode> {
  private context: FxContext;
  private grouper: TemplateGrouper;
  private parser: NodeParser;

  constructor(context: FxContext) {
    this.grouper = new TemplateGrouper();
    this.parser = new NodeParser(
      new ExpressionParser(),
      new OperatorContextParser(context),
      new OperatorParser(context),
      new OptimizerImplGlue(),
      new Optimizer(),
      new ContextParser(),
      new CompilerImplGlue(context));
  }

  parse(template: any): FxTokenNode {
    const root = this.grouper.parse(template);
    this.parser.parse(root);
    return root;
  }
}

class OptimizerImplGlue implements FxParser<FxTokenNode> {

  readonly optimizer: Optimizer;

  constructor() {
    this.optimizer = new Optimizer();
  }

  parse(item: FxTokenNode): void {
    if (!item.optimizer) {
      item.optimizer = this.optimizer.backupParse.bind(this.optimizer);
    }
  }
}

class CompilerImplGlue implements FxParser<FxTokenNode> {

  readonly compiler: FxCompiler;

  constructor(context: FxContext) {
    this.compiler = new FxCompiler(context);
  }

  parse(item: FxTokenNode): void {
    if (!item.compiler) {
      item.compiler = this.compiler.backupCompile.bind(this.compiler);
    }
  }
}
