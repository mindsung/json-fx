import { Expression } from "../core/expression";
import { TransformExpression } from "../core/transform-expression";

export class PropertyExpression<TIn, TOut> extends TransformExpression<TIn, TOut> {
  constructor(input: Expression<TIn>, private path: Expression<string>) {
    super(false, input, [path]);
  }

  transform(inputValue: TIn) {
    let out = inputValue as any;
    let pathValue = this.path != null ? (this.path.evaluate() || "") : "";
    if (pathValue.startsWith(".")) {
      pathValue = pathValue.substring(1);
    }
    const parts = pathValue.split(".").filter(p => p.length > 0);
    for (let i = 0; i < parts.length; i++) {
      out = out[parts[i]];
      if (out == null) {
        return null;
      }
    }
    return out as TOut;
  }
}
