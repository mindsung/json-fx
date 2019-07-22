import { FxTokenNode } from "./model/fx-token-node";
import { FxParser } from "./model/fx-parser";
import { Loader } from "./loader";

export class OperatorLoader implements FxParser<FxTokenNode> {

  private readonly loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }

  parse(token: FxTokenNode): void {
    const op = this.loader.getOperator(token.symbol);

    if (op) {
      token.operator = op;
      token.tag = "operator";
    }
  }
}
