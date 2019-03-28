import { Expression, ExpressionScope } from "./expression";

export class FxModule {
  readonly expressions: Map<string, Expression>;
  readonly operators: Map<string, Expression>;

  constructor(expressions: ReadonlyArray<Expression>) {
    this.expressions = new Map<string, Expression>();
    this.operators = new Map<string, Expression>();

    this.define(...expressions);
  }

  define(...expressions: Expression[]) {
    for (const expr of expressions) {
      // TODO: Allow overrides check
      this.expressions.set(expr.key, expr);

      if (expr.operator) {
        this.operators.set(expr.operator.key, expr);
      }
    }
  }

  getExpression(key: string): Expression {
    return this.expressions.has(key) ? this.expressions.get(key) : null;
  }

  getOperator(key: string): Expression {
    return this.operators.has(key) ? this.operators.get(key) : null;
  }

  createScope(key: string): ExpressionScope {
    const expr = this.getExpression(key);
    if (!expr) {
      throw new Error(`Expression ${key} is undefined`);
    } else {
      return new ExpressionScope(expr);
    }
  }
}
