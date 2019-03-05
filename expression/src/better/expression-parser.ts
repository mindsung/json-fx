import {Expression, ExpressionScope, ScopeVariable} from "./expression";
import {stockExpressions} from "./stock-expressions";
import {coreExpressions, createExpressionConstant} from "./expressions/core-expressions";
import {ExpressionEvaluator} from "./expression-evaluator";

export class ExpressionParser {
  constructor(expressions: ReadonlyArray<Expression> = ExpressionParser.defaultExpressions) {
    this.addExpressions(coreExpressions);
    if (expressions != null) {
      this.addExpressions(expressions);
    }
  }

  public static setDefaultExpressions(expressions: ReadonlyArray<Expression>) {
    ExpressionParser.defaultExpressions = expressions;
  }
  private static defaultExpressions = stockExpressions;

  private expressionMap: { [key: string]: Expression } = {};
  private tokenMap: { [key: string]: Expression } = {};

  public addExpressions(expressions: ReadonlyArray<Expression>) {
    expressions.forEach(expr => {
      if (this.expressionMap[expr.key] != null && !expr.isOverride) {
        throw new Error(`Duplicate expression key "${expr.key}". Set "isOverride = true" to allow override of a previously mapped expression.`);
      }
      if (expr.token != null) {
        if (this.tokenMap[expr.token.key] != null && !expr.isOverride) {
          throw new Error(`Duplicate expression token "${expr.token.key}". Set "isOverride = true" to allow override of a previously mapped expression token.`);
        }
        this.tokenMap[expr.token.key] = expr;
      }
      this.expressionMap[expr.key] = expr;
    });
  }

  public createExpressionScope(exprKey: string,
                               params?: ReadonlyArray<ExpressionScope>,
                               vars?: ReadonlyArray<ScopeVariable>) {
    const exprInfo = this.expressionMap[exprKey];
    if (exprInfo == null) {
      throw new Error(`Expression "${exprKey}" is not defined.`);
    }
    return new ExpressionScope(exprInfo, params, vars);
  }

  public parse(template: any): ExpressionEvaluator {
    // TODO
    return null;
  }
}

const tempParser = new ExpressionParser();
export function $expr(exprKey: string, params?: ReadonlyArray<ExpressionScope>, vars?: ReadonlyArray<ScopeVariable>) {
  return tempParser.createExpressionScope(exprKey, params, vars);
}
export function $const(value: any) {
  return createExpressionConstant(value);
}
export function $eval(input: any, expr: ExpressionScope) {
  expr.vars = [{ name: "$", scope: $const(input) }];
  return expr.value;
}
