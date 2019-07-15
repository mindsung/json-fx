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

        if (lvalue.first) {
          if (lvalue.first.tag != "group") {
            lvalue.first.wrap(new FxTokenNode("signature"));
          } else {
            lvalue.first.tag = "signature";
          }
        }
        break;
    }

    // lvalue.children.forEach(child => this.makeLValue(child));
  }
}
