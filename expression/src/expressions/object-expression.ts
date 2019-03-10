import { OldExpression } from "../core/expression";

export interface KeyValueExpressionPair {
  key: OldExpression<string>;
  value: OldExpression<any>;
}

export class ObjectExpression extends OldExpression<{}> {
  constructor(...kvs: KeyValueExpressionPair[]) {
    super(true, kvs.map(kv => kv.key as OldExpression<any>).concat(kvs.map(kv => kv.value)));
    this.kvs = kvs;
  }
  private kvs: KeyValueExpressionPair[];

  protected out() {
    const out = {};
    this.kvs.forEach(kv => out[kv.key.evaluate()] = kv.value.evaluate());
    return out;
  }
}
