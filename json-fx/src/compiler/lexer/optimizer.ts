import {FxParser} from "./model/fx-parser";
import {FxTokenNode} from "./model/fx-token-node";
import {FxIntrinsic} from "../../defs";

export class Optimizer extends FxParser<FxTokenNode, void> {
  private child: FxTokenNode;

  parse(root: FxTokenNode): void {
    for (this.child of root.children) {
      if (this.child.tag == "group" && this.child.symbol == "()" && this.child.count <= 1) {
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
    // TODO: This is a absolute monstrosity
    // A quick hack allowing invoke to accept list of parameters, e.g. (5, 10):math~randint

    if (this.child.parent && this.child.parent.parent && this.child.parent.parent.tag == "object") {
      this.child.first.add(this.child.last);
      this.child.unwrap();

    } else {
      if (this.child.first.tag == "group") {
        while (this.child.first.count) {
          this.child.last.add(this.child.first.last, 0);
        }

        this.child.first.orphan();

      } else {
        this.child.last.unshift(this.child.first);
      }

      if (this.child.last.tag == "identifier") {
        this.child.last.tag = "expression";
      }

      this.child.unwrap();
    }
  }

  private optimizeNullInvoke() {
    this.child.last.unshift(this.child.first);

    if (this.child.last.tag == "identifier") {
      this.child.last.tag = "expression";
    }
  }

  private optimizeLambda() {
    this.child.tag = "lambda";
    if (this.child.first.tag != "group") {
      const wrapper = new FxTokenNode("group");
      wrapper.isLvalue = true;
      this.child.first.wrap(wrapper);
    } else {
      this.child.first.symbol = "vars";
    }
  }
}
