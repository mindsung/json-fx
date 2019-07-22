import { FxTokenNode } from "./model/fx-token-node";
import { Loader } from "./loader";
import { FxParser } from "./model/fx-parser";

export class DefinitionLoader implements FxParser<FxTokenNode> {

  private loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }

  public parse(token: FxTokenNode): void {
    const def = this.loader.getDefinition(token.symbol, token.tag);
    token.optimizer = def.optimizer;
    token.compiler = def.compiler;
    token.evaluator = def.evaluator;
  }
}
