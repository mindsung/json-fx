import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";

export class ContextParser implements FxParser<FxTokenNode> {
  parse(item: FxTokenNode) {
    if (item.isLvalue) {
      this.makeLValue(item);
    }
  }

  private makeLValue(lvalue: FxTokenNode) {
    switch (lvalue.tag) {
      case "variable":
        break;
      case "template-call":
        lvalue.tag = "template";
        break;
    }
  }
}
