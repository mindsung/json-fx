import { FxDefinition, FxExpressionDefinition, FxIntrinsicDefinition } from "../lexer/model/fx-definition";
import { FxTokenNode } from "../lexer/model/fx-token-node";
import { intrinsics } from "../lexer/model/fx-intrinsic-definition";

export class NewFxLoader {

  private operators: { [index: string]: FxDefinition };
  private definitions: { [index: string]: FxDefinition };

  constructor(...expressions: FxExpressionDefinition[][]) {
    this.operators = {};
    this.definitions = {};

    expressions.forEach(
      set => set.forEach(
        def => this.defineExpression(def)));

    intrinsics.forEach(intr => this.defineIntrinsic(intr));
  }

  public defineIntrinsic(def: FxIntrinsicDefinition): void {
    const hash = NewFxLoader.hashDefinition(def.tag);

    const fxdef: FxDefinition = {
      operator: def.operator,
      compiler: def.compiler,
      optimizer: def.optimizer
    };

    this.definitions[hash] = fxdef;

    if (def.operator) {
      this.defineOperator(def.operator.symbol, fxdef);
    }
  }

  public defineExpression(def: FxExpressionDefinition): void {
    const hash = NewFxLoader.hashDefinition("identifier", def.name);

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

    if (!def) {
      def = this.getDefinition(node);
    }

    if (def) {
      node.operator = def.operator;
      node.optimizer = def.optimizer;
      node.compiler = def.compiler;
    }
  }

  private getDefinition(node: FxTokenNode): FxDefinition {
    const strictHash = NewFxLoader.hashDefinition(node.tag, node.symbol);
    const tagHash = NewFxLoader.hashDefinition(node.tag);

    if (this.definitions[strictHash]) {
      return this.definitions[strictHash];
    } else if (this.definitions[tagHash]) {
      return this.definitions[tagHash];
    } else {
      return null;
    }
  }

  private static hashDefinition(tag?: string, symbol?: string): string {
    tag = tag || "*";
    symbol = symbol || "*";

    return `<${tag}>${symbol}`;
  }
}
