import { Expression, ExpressionScope, ScopeVariable } from "./expression";
import { fxCoreExpressions } from "../expressions/fx-core-expressions";
import { stockExpressions } from "../expressions";

export class ExpressionSet {
  constructor(expressions: ReadonlyArray<Expression> = ExpressionSet.defaultExpressions) {
    this.addExpressions(fxCoreExpressions);
    if (expressions != null) {
      this.addExpressions(expressions);
    }
  }

  public static setDefaultExpressions(expressions: ReadonlyArray<Expression>) {
    ExpressionSet.defaultExpressions = [].concat(expressions);
  }

  public static addDefaultExpressions(expressions: ReadonlyArray<Expression>) {
    ExpressionSet.defaultExpressions.push(...expressions);
  }

  private static defaultExpressions: Expression[] = stockExpressions.concat();

  public readonly tokenMap: { [key: string]: Expression } = {};

  private expressionMap: { [key: string]: Expression } = {};

  public addExpressions(expressions: ReadonlyArray<Expression>) {
    expressions.forEach(expr => {
      const mapKey = expr.key.toLowerCase();
      if (this.expressionMap[mapKey] != null && !expr.isOverride) {
        throw new Error(`Duplicate expression key "${expr.key}". Set "isOverride = true" to allow override of a previously mapped expression.`);
      }
      if (expr.token != null) {
        if (this.tokenMap[expr.token.key] != null && !expr.isOverride) {
          throw new Error(`Duplicate expression token "${expr.token.key}". Set "isOverride = true" to allow override of a previously mapped expression token.`);
        }
        this.tokenMap[expr.token.key] = expr;
      }
      this.expressionMap[mapKey] = expr;
    });
  }

  public createExpressionScope(exprKey: string) {
    const exprInfo = this.expressionMap[exprKey.toLowerCase()];
    if (exprInfo == null) {
      throw new Error(`Expression "${exprKey}" is not defined.`);
    }
    return new ExpressionScope(exprInfo);
  }
}
