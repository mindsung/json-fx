import {FxModule} from "./fx-module";
import {FxOperator} from "../parser/fx-operator";

export class FxCore extends FxModule {
  constructor() {
    super();
    this.addOperators(
      new FxOperator("=", ":set", 0),

      new FxOperator("&&", ":and", 1),
      new FxOperator("||", ":or", 1),

      new FxOperator("==", ":equalTo", 2),
      new FxOperator("!=", ":notEqualTo", 2),
      new FxOperator("<", ":lessThan", 2),
      new FxOperator("<=", ":lessThanOrEqualTo", 2),
      new FxOperator(">", ":greaterThan", 2),
      new FxOperator(">=", ":greaterThanOrEqualTo", 2),

      new FxOperator("+", ":add", 3),
      new FxOperator("-", ":sub", 3),

      new FxOperator("*", ":mul", 4),
      new FxOperator("/", ":div", 4));
  }
}
