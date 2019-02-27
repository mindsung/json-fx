import {Expression} from "../core/expression";
import {TransformExpression} from "../core/transform-expression";

export class PropertyExpression<TIn, TOut> extends TransformExpression<TIn, TOut> {
  constructor(input: Expression<TIn>, private path: Expression<string>) {
    super(false, input, [path]);
  }

  transform(inputValue: TIn) {
    const key = this.path != null ? this.path.evaluate() || "" : "";

    if (Array.isArray(inputValue)) {
      const result: Array<any> = [];

      for (const item of inputValue) {
        const value = this.transformItem(item, key);

        if (Array.isArray(value)) {
          result.push(...value);
        } else {
          result.push(value);
        }
      }

      // @ts-ignore
      return result as TOut;

    } else {
      return this.transformItem(inputValue, key);
    }

    /*    let out = inputValue as any;
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
        return out as TOut;*/
  }

  private transformItem(obj: TIn, key: string): TOut {
    if (obj !== null) {
      return obj.hasOwnProperty(key) ? obj[key] : null;
    } else {
      return null;
    }
  }
}
