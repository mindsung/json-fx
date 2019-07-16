import { intrinsics } from "../lexer/model/fx-intrinsic-definition";
import { FxDefinition, FxExpressionDefinition, FxIntrinsicDefinition } from "../lexer/model/fx-definition";
import { FxTokenNode } from "../lexer/model/fx-token-node";
import { exprIntrinsic } from "../../expressions/expr-intrinsic";

export class FxLoader {
  private readonly operators: { [index: string]: FxDefinition };
  private readonly definitions: { [index: string]: FxDefinition };

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.operators = {};
    this.definitions = {};

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
      evaluator: def.evaluator,
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
    const def = this.getDefinition(node);

    if (this.operators[node.symbol]) {
      node.tag = "operator";
    }

    node.operator = def.operator;
    node.evaluator = def.evaluator;
    node.optimizer = def.optimizer;
    node.compiler = def.compiler;
  }

  private getDefinition(node: FxTokenNode): FxDefinition {
    const oprDef = FxLoader.sanitizeObject(this.operators[node.symbol]);
    const strDef = FxLoader.sanitizeObject(this.definitions[FxLoader.hash(node.tag, node.symbol)]);
    const tagDef = FxLoader.sanitizeObject(this.definitions[FxLoader.hash(node.tag, null)]);
    const symDef = FxLoader.sanitizeObject(this.definitions[FxLoader.hash(null, node.symbol)]);

    return Object.assign({}, symDef, tagDef, strDef, oprDef);
  }

  private static sanitizeObject(obj: any): any {
    const clone = Object.assign({}, obj);

    for (const key of Object.keys(clone)) {
      if (clone[key] == null) {
        delete clone[key];
      }
    }

    return clone;
  }

  private static hash(tag?: string, symbol?: string): string {
    tag = tag || "*";
    symbol = symbol || "*";

    return `<${tag}>${symbol}`;
  }
}
