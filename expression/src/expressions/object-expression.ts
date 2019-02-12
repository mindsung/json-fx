import { Expression } from "../core/expression";

export interface KeyValueExpressionPair {
  key: Expression<string>,
  value: Expression<any>
}

export class ObjectExpression extends Expression<{}> {
  constructor(...kvs: KeyValueExpressionPair[]) {
    super(true, kvs.map(kv => kv.key as Expression<any>).concat(kvs.map(kv => kv.value)));
    this.kvs = kvs;
  }
  private kvs: KeyValueExpressionPair[];

  protected out() {
    const out = {};
    this.kvs.forEach(kv => out[kv.key.evaluate()] = kv.value.evaluate());
    return out;
  }
}
