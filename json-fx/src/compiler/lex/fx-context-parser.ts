import {FxParser} from "./model/fx-parser";
import {FxToken} from "./model/fx-token";

export class FxContextParser extends FxParser<FxToken> {
  parse(item: FxToken) {
    if (item.isLvalue) {
      this.makeLValue(item);
    }
  }

  private makeLValue(lvalue: FxToken) {
    switch (lvalue.tag) {
      case "variable":
        break;
      case "template-call":
        lvalue.tag = "template";
        break;
    }

    lvalue.children.forEach(child => this.makeLValue(child));
  }
}
