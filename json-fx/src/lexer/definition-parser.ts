import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";

export class DefinitionParser implements FxParser<FxTokenNode, void> {

  private context: FxContext;

  constructor(context: FxContext) {
    this.context = context;
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

      this.context.loader.load(child);
      lastChild = child;
    }

    if (!token.parent) {
      this.context.loader.load(token);
    }
  }
}
