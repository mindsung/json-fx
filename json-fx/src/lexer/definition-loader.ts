import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { Loader } from "./loader";

export class DefinitionLoader implements FxParser<FxTokenNode, void> {

  private loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }

  public parse(token: FxTokenNode): void {
    // TODO: Code cleanup, edge case considerations

    let lastChild: FxTokenNode = null;

    for (const child of token.children) {
      if (child.tag == "operator" && child.symbol == "-" && (!lastChild || lastChild.tag == "operator")) {
        child.symbol = "-u";
      }

      // This only works in few cases (where the object literal contains no instances of a legitimate invoke ":" operator
      else if (child.parent && child.parent.tag == "object" && child.tag == "operator" && child.symbol == ":") {
        child.symbol = ":a";
      }

      const def = this.loader.getDefinition(child.symbol, child.tag);
      child.optimizer = def.optimizer;
      child.compiler = def.compiler;
      child.evaluator = def.evaluator;

      lastChild = child;
    }

    if (!token.parent) {
      const def = this.loader.getDefinition(token.symbol, token.tag);
      token.optimizer = def.optimizer;
      token.compiler = def.compiler;
      token.evaluator = def.evaluator;
    }
  }
}
