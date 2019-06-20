import {FxParser} from "./model/fx-parser";
import {FxToken} from "./model/fx-token";
import {FxIntrinsic} from "../../defs";

export class FxOptimizer extends FxParser<FxToken, void> {
  private child: FxToken;

  parse(root: FxToken): void {
    for (this.child of root.children) {
      if (this.child.tag === "group" && this.child.symbol === "()" && this.child.childCount <= 1) {
        this.child.unwrap();

      } else if (this.child.operator) {
        this.optimizeIntrinsics();
      }
    }
  }

  private optimizeIntrinsics() {
    switch (this.child.operator.symbol) {
      case FxIntrinsic.Tuple:
        this.optimizeTuple();
        break;

      case FxIntrinsic.Invoke:
        this.optimizeInvoke();
        break;

      case FxIntrinsic.NullInvoke:
        this.optimizeNullInvoke();
        break;

      case FxIntrinsic.Lambda:
        this.optimizeLambda();
        break;

      case FxIntrinsic.Prop:
        this.child.tag = "prop";
        break;

      case FxIntrinsic.NullProp:
        this.child.tag = "nullprop";
        break;
    }
  }

  private optimizeTuple() {
    this.child.unwrap();
  }

  private optimizeInvoke() {
    this.child.lastChild.unshiftChild(this.child.firstChild);

    if (this.child.lastChild.tag === "identifier") {
      this.child.lastChild.tag = "expression";
    }

    this.child.unwrap();
  }

  private optimizeNullInvoke() {
    this.child.lastChild.unshiftChild(this.child.firstChild);

    if (this.child.lastChild.tag === "identifier") {
      this.child.lastChild.tag = "expression";
    }
  }

  private optimizeLambda() {
    this.child.tag = "lambda";
    if (this.child.firstChild.tag !== "group") {
      const wrapper = new FxToken("vars", -1, "group");
      wrapper.isLvalue = true;
      this.child.firstChild.wrap(wrapper);
    } else {
      this.child.firstChild.symbol = "vars";
    }
  }

  private optimizeProp() {
    this.child.tag = "prop";
  }
}
