import { FxDefinition, FxExpressionDefinition, FxIntrinsicDefinition } from "./model/fx-definition";
import { FxTokenNode } from "./model/fx-token-node";
import { Fx } from "../fx";

export class FxLoader {

  private readonly operators: { [index: string]: FxDefinition };
  private readonly definitions: { [index: string]: FxDefinition };

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.operators = {};
    this.definitions = {};

    Fx.Expressions.forEach(expr => this.defineExpression(expr));
    Fx.Intrinsics.forEach(intr => this.defineIntrinsic(intr));

    for (const set of expressions) {
      set.forEach(expr => this.defineExpression(expr));
    }
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
    const oprDef = FxLoader.sanitize(this.operators[node.symbol]);
    const strDef = FxLoader.sanitize(this.definitions[FxLoader.hash(node.tag, node.symbol)]);
    const tagDef = FxLoader.sanitize(this.definitions[FxLoader.hash(node.tag, null)]);
    const symDef = FxLoader.sanitize(this.definitions[FxLoader.hash(null, node.symbol)]);

    return Object.assign({}, symDef, tagDef, strDef, oprDef);
  }

  private static sanitize(obj: any): any {
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