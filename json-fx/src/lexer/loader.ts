import { FxDefinition, FxExpressionDefinition, FxIntrinsicDefinition, FxOperatorDefinition } from "./model/fx-definition";
import { FxTokenNode } from "./model/fx-token-node";
import { Fx } from "../fx";
import { FxTokenTag } from "./model/fx-token-tag";

export class Loader {

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
    const hash = Loader.hash(def.tag);

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
    const hash = Loader.hash(null, def.name);

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

  public getOperator(symbol: string): FxOperatorDefinition {
    const def = this.operators[symbol];
    if (def) {
      return def.operator;
    } else {
      return null;
    }
  }

  public getDefinition(symbol: string, tag: FxTokenTag): FxDefinition {
    let tagDef: {};
    let operatorDef: {};
    let strictDef: {};
    let symbolDef: {};

    tagDef = Loader.sanitize(this.definitions[Loader.hash(tag, null)]);

    if (tag == "operator" || tag == "expression" || tag == "identifier") {
      operatorDef = Loader.sanitize(this.operators[symbol]);
    }

    if (tag != "literal" && tag != "numeric") {
      strictDef = Loader.sanitize(this.definitions[Loader.hash(tag, symbol)]);
      symbolDef = Loader.sanitize(this.definitions[Loader.hash(null, symbol)]);
    }

    return Object.assign({}, symbolDef, tagDef, strictDef, operatorDef);
  }

  private static sanitize(obj: any): any {
    const result = {};

    if (obj) {
      for (const key of Object.keys(obj)) {
        if (obj[key] != null) {
          result[key] = obj[key];
        }
      }
    }

    return result;
  }

  private static hash(tag?: string, symbol?: string): string {
    tag = tag || "*";
    symbol = symbol || "*";

    return `<${ tag }>${ symbol }`;
  }
}
