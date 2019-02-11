import { Expression } from "../core/expression";

export interface KeyValueExpressionPair {
  key: Expression<string>,
  value: Expression<any>
}

export class ObjectExpression extends Expression<{}> {
  constructor(private kvs: Array<{ key: Expression<string>, value: Expression<any> }>) {
    super(true, kvs.map(kv => kv.key as Expression<any>).concat(kvs.map(kv => kv.value)));
  }

  protected out() {
    const out = {};
    this.kvs.forEach(kv => out[kv.key.evaluate()] = kv.value.evaluate());
    return out;
  }
}
