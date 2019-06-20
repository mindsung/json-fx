import { FxExpressionDefinition, FxOperatorDefinition } from "../../defs";
import { exprIntrinsic } from "../../expressions/expr-intrinsic";

export class FxLoader {
  readonly expressions: Map<string, FxExpressionDefinition>;
  readonly operators: Map<string, FxOperatorDefinition>;

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.expressions = new Map<string, FxExpressionDefinition>();
    this.operators = new Map<string, FxOperatorDefinition>();

    this.define(...exprIntrinsic);
    expressions.forEach(exp => this.define(...exp));
  }

  define(...expressions: FxExpressionDefinition[]) {
    for (const expr of expressions) {
      this.expressions.set(expr.name, expr);

      if (expr.operator) {
        this.operators.set(expr.operator.symbol, {
          symbol: expr.name,
          precedence: expr.operator.precedence,
          assoc: expr.operator.assoc || "left",
          isUnary: !!expr.operator.isUnary
        });
      }
    }
  }

  getExpression(name: string): FxExpressionDefinition {
    return this.expressions.has(name) ? this.expressions.get(name) : null;
  }

  getOperator(name: string): FxOperatorDefinition {
    return this.operators.has(name) ? this.operators.get(name) : null;
  }
}
