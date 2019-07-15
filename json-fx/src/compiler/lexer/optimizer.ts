import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxIntrinsic } from "../../defs";

export class Optimizer implements FxParser<FxTokenNode, void> {
  private root: FxTokenNode;

  parse(root: FxTokenNode): void {
    root.optimize();
  }

  public backupParse(root: FxTokenNode): void {
    this.root = root;

    if (this.root.tag == "group" && this.root.count <= 1) {
      this.root.unwrap();

    } else if (this.root.operator) {
      this.optimizeIntrinsics();
    }
  }

  private optimizeIntrinsics() {
    switch (this.root.operator.symbol) {
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
        this.root.tag = "prop";
        break;

      case FxIntrinsic.NullProp:
        this.root.tag = "nullprop";
        break;

      case "assign":
        this.root.first.add(this.root.last);
        this.root.unwrap();
        break;
    }
  }

  private optimizeTuple() {
    this.root.unwrap();
  }

  private optimizeInvoke() {
    // TODO: This is a absolute monstrosity
    // A quick hack allowing invoke to accept list of parameters, e.g. (5, 10):math~randint

    if (this.root.parent && this.root.parent.parent && this.root.parent.parent.tag == "object") {
      this.root.first.add(this.root.last);
      this.root.unwrap();

    } else {
      if (this.root.first.tag == "group") {
        while (this.root.first.count) {
          this.root.last.add(this.root.first.last, 0);
        }

        this.root.first.orphan();

      } else {
        this.root.last.unshift(this.root.first);
      }

      if (this.root.last.tag == "identifier") {
        this.root.last.tag = "expression";
      }

      this.root.unwrap();
    }
  }

  private optimizeNullInvoke() {
    this.root.last.unshift(this.root.first);

    if (this.root.last.tag == "identifier") {
      this.root.last.tag = "expression";
    }
  }

  private optimizeLambda() {
    this.root.tag = "lambda";
    if (this.root.first.tag != "group") {
      const wrapper = new FxTokenNode("signature");
      wrapper.isLvalue = true;
      this.root.first.wrap(wrapper);
    } else {
      this.root.first.tag = "signature";
    }
  }
}
