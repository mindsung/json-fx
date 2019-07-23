import { FxTokenNode } from "./node/fx-token-node";
import { Loader } from "./loader";
import { FxParser } from "../model/fx-parser";

export class DefinitionLoader implements FxParser<FxTokenNode> {

  private loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }

  public parse(token: FxTokenNode): void {
    token.definition = this.loader.getDefinition(token.symbol, token.tag);
  }
}
