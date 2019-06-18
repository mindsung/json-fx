import { FxParser } from "./model/fx-parser";
import { FxToken } from "./model/fx-token";
import { FxIntrinsic } from "../../defs";

export class FxOptimizer extends FxParser<FxToken, void> {
  private child: FxToken;

  evaluate(root: FxToken): void {
    for (this.child of root.children) {
      if (this.child.tag === "group" && this.child.symbol === "()" && this.child.childCount <= 1) {
        this.child.unwrap();

      } else if (this.child.operator) {
        this.evaluateIntrinsics();
      }
    }
  }

  private evaluateIntrinsics() {
    const child = this.child;

    switch (child.operator.symbol) {
      case FxIntrinsic.Tuple:
        child.unwrap();
        break;

      case FxIntrinsic.Invoke:
        child.lastChild.unshiftChild(child.firstChild);

        if (child.lastChild.tag === "identifier") {
          child.lastChild.tag = "expression";
        }

        child.unwrap();
        break;

      case FxIntrinsic.Lambda:
        child.tag = "lambda";
        if (child.firstChild.tag !== "group") {
          const wrapper = new FxToken("vars", -1, "group");
          wrapper.isLvalue = true;
          child.firstChild.wrap(wrapper);
        } else {
          child.firstChild.symbol = "vars";
        }
        break;
    }
  }
}
