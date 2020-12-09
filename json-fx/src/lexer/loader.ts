import { FxDefinition, FxExpressionDefinition, FxIntrinsicDefinition, FxOperatorDefinition } from "../model/fx-definition";
import { Fx } from "../fx";
import { FxTokenTag } from "../model/fx-token-tag";

export class Loader {

  private readonly operators: { [index: string]: FxDefinition };
  private readonly definitions: { [index: string]: FxDefinition };

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.operators = {};
    this.definitions = {};

    Fx.Intrinsics.forEach(intr => this.defineIntrinsic(intr));
    Fx.Functions.forEach(expr => this.defineExpression(expr));

    for (const set of expressions) {
      set.forEach(expr => this.defineExpression(expr));
    }
  }

  public defineIntrinsic(def: FxIntrinsicDefinition): void {
    const fxdef = Loader.sanitize({
      operator: def.operator,
      evaluator: def.evaluator,
      optimizer: def.optimizer,
      validator: def.validator,
      compiler: def.compiler
    });

    if (def.tag) {
      this.definitions[Loader.hash(def.tag)] = fxdef;
    }

    if (def.operator) {
      this.defineOperator(def.operator.symbol, fxdef);
    }
  }

  public defineExpression(def: FxExpressionDefinition): void {
    const fxdef = Loader.sanitize({
      operator: def.operator,
      evaluator: def
    });

    this.definitions[Loader.hash(null, def.name)] = fxdef;

    if (def.operator) {
      this.defineOperator(def.operator.symbol, fxdef);
    }
  }

  private defineOperator(symbol: string, def: FxDefinition): void {
    this.operators[symbol] = def;
  }

  public getOperator(symbol: string): FxOperatorDefinition {
    const def = this.operators[symbol];
    return def ? def.operator : null;
  }

  public getDefinition(symbol: string, tag: FxTokenTag): FxDefinition {
    let operatorDef: {};
    let strictDef: {};
    let symbolDef: {};
    let tagDef: {};

    if (tag == "operator" || tag == "expression" || tag == "identifier") {
      operatorDef = this.operators[symbol];
    }

    if (tag != "literal" && tag != "numeric") {
      strictDef = this.definitions[Loader.hash(tag, symbol)];
      symbolDef = this.definitions[Loader.hash(null, symbol)];
    }

    tagDef = this.definitions[Loader.hash(tag, null)];

    return Object.assign({}, tagDef, symbolDef, strictDef, operatorDef);
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

    return `${ symbol } [${ tag }]`;
  }
}
