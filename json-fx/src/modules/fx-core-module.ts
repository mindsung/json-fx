import {FxModule} from "./fx-module";
import {FxOperator} from "../parser/fx-operator";

export class FxCoreModule extends FxModule {
  constructor() {
    super();
    this.addOperators(
      new FxOperator("=", "set", 0),

      new FxOperator("&&", "and", 1),
      new FxOperator("||", "or", 1),

      new FxOperator("==", "eq", 2),
      new FxOperator("!=", "neq", 2),
      new FxOperator("<", "lt", 2),
      new FxOperator("<=", "lte", 2),
      new FxOperator(">", "gt", 2),
      new FxOperator(">=", "gte", 2),

      new FxOperator("+", "add", 3),
      new FxOperator("-", "sub", 3),

      new FxOperator("*", "mul", 4),
      new FxOperator("/", "div", 4));
  }
}
