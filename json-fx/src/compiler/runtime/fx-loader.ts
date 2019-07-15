import { FxExpressionDefinition, FxOperatorDefinition } from "../../defs";
import { exprIntrinsic } from "../../expressions/expr-intrinsic";
import { FxIntrinsicDefinition, intrinsics } from "../lexer/model/fx-intrinsic-definition";

export class FxLoader {
  readonly expressions: Map<string, FxExpressionDefinition>;
  readonly operators: Map<string, FxOperatorDefinition>;

  readonly intrinsics: { [index: string]: FxIntrinsicDefinition };

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.expressions = new Map<string, FxExpressionDefinition>();
    this.operators = new Map<string, FxOperatorDefinition>();

    this.define(...exprIntrinsic);
    expressions.forEach(exp => this.define(...exp));

    // TODO: Code cleanup
    this.intrinsics = intrinsics.reduce((obj, item) => {
      obj[item.tag] = item;
      return obj;
    }, {});
    intrinsics.forEach(intrinsic => {
      if (intrinsic.operator) {
        this.operators.set(intrinsic.operator.symbol, intrinsic.operator);
      }
    });
  }

  define(...expressions: FxExpressionDefinition[]): void {
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

  public getIntrinsic(tag: string): FxIntrinsicDefinition {
    return this.intrinsics[tag];
  }

  public getExpression(name: string): FxExpressionDefinition {
    return this.expressions.has(name) ? this.expressions.get(name) : null;
  }

  public getOperator(name: string): FxOperatorDefinition {
    return this.operators.has(name) ? this.operators.get(name) : null;
  }
}
