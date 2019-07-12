import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";

export class OperatorContextParser extends FxParser<FxTokenNode, void> {

  public parse(item: FxTokenNode): void {
    if (item.parent && item.parent.tag == "object" && item.tag == "operator" && item.symbol == ":") {
      item.symbol = ":a";
    }
  }
}
