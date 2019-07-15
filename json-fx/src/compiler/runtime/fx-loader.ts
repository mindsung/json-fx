import { intrinsics } from "../lexer/model/fx-intrinsic-definition";
import { FxDefinition, FxExpressionDefinition, FxIntrinsicDefinition } from "../lexer/model/fx-definition";
import { FxTokenNode } from "../lexer/model/fx-token-node";
import { exprIntrinsic } from "../../expressions/expr-intrinsic";
import { Optimizer } from "../lexer/optimizer";
import { FxCompiler } from "./fx-compiler";

export class FxLoader {
  private readonly operators: { [index: string]: FxDefinition };
  private readonly definitions: { [index: string]: FxDefinition };

  private optimizer: Optimizer;
  private compiler: FxCompiler;

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.operators = {};
    this.definitions = {};

    this.optimizer = new Optimizer();
    this.compiler = new FxCompiler();

    expressions.forEach(
      set => set.forEach(
        def => this.defineExpression(def)));

    exprIntrinsic.forEach(def => this.defineExpression(def));

    intrinsics.forEach(intr => this.defineIntrinsic(intr));
  }

  public defineIntrinsic(def: FxIntrinsicDefinition): void {
    const hash = FxLoader.hash(def.tag);

    const fxdef: FxDefinition = {
      operator: def.operator,
      compiler: def.compiler,
      optimizer: def.optimizer
    };

    if (def.tag) {
      this.definitions[hash] = fxdef;
    }

    if (def.operator) {
      this.defineOperator(def.operator.symbol, fxdef);
    }
  }

  public defineExpression(def: FxExpressionDefinition): void {
    const hash = FxLoader.hash(null, def.name);

    const fxdef: FxDefinition = {
      operator: def.operator,
      evaluator: def
    };

    this.definitions[hash] = fxdef;

    if (def.operator) {
      this.defineOperator(def.operator.symbol, fxdef);
    }
  }

  private defineOperator(symbol: string, def: FxDefinition): void {
    this.operators[symbol] = def;
  }

  public load(node: FxTokenNode): void {
    let def = this.operators[node.symbol];

    if (def) {
      node.tag = "operator";
    } else {
      def = this.getDefinition(node);
    }

    if (def) {
      node.operator = def.operator;
      node.evaluator = def.evaluator;
      node.optimizer = def.optimizer;
      node.compiler = def.compiler;
    }

    if (!node.optimizer) {
      node.optimizer = this.optimizer.backupParse.bind(this.optimizer);
    }

    if (!node.compiler) {
      node.compiler = this.compiler.backupCompile.bind(this.compiler);
    }
  }

  private getDefinition(node: FxTokenNode): FxDefinition {
    const strictHash = FxLoader.hash(node.tag, node.symbol);
    const tagHash = FxLoader.hash(node.tag, null);
    const symbolHash = FxLoader.hash(null, node.symbol);

    if (this.definitions[strictHash]) {
      return this.definitions[strictHash];
    } else if (this.definitions[tagHash]) {
      return this.definitions[tagHash];
    } else if (this.definitions[symbolHash]) {
      return this.definitions[symbolHash];
    } else {
      return null;
    }
  }

  private static hash(tag?: string, symbol?: string): string {
    tag = tag || "*";
    symbol = symbol || "*";

    return `<${tag}>${symbol}`;
  }
}
