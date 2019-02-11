import { Expression } from "../core/expression";
import { TransformExpression } from "../core/transform-expression";
import { ConstantExpression } from "./constant-expression";

export class OutputTransformExpression extends TransformExpression<any, any> {
    constructor(input: Expression<any>, private output: Expression<any>) {
      super(input, [output]);
      if (input == null) {
        throw new Error("Output transform requires an input expression.");
      }
      else if (output == null) {
        throw new Error("Output transform requires an output expression.");
      }
      // Set the root scope input.
      this.scope.addVariableAlias("$*", "$"); // Base class added $ to scope
      // Set special constant variables.
      this.scope.addVariableExpression("$null", new ConstantExpression(null));
    }
  
    transform() {
      return this.output.evaluate();
    }
  }
  