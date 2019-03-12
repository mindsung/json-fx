import {Expression, ExpressionScope} from "../core/expression";
import {createExpressionLambda, createExpressionConstant} from "./core-expressions";

function lambdaEvaluator(expr: ExpressionScope, parentScope: ExpressionScope, callback: (evaluator: { evaluate: (item: any) => any }) => any) {
  const lambda = createExpressionLambda(["$"], expr);
  if (parentScope) {
    parentScope.addToScope(lambda);
  }
  try {
    return callback({
      evaluate: (item: any) => {
        lambda.params = [createExpressionConstant(item)];
        return lambda.value;
      }
    });
  }
  finally {
    if (parentScope) {
      parentScope.removeFromScope(lambda);
    }
  }
}

function minOf(val1: any, val2: any) {
  return val1 == null && val2 == null ? null
    : val1 == null ? val2
      : val2 == null ? val1
        : val2 < val1 ? val2
          : val1;
}

function maxOf(val1: any, val2: any) {
  return val1 == null && val2 == null ? null
    : val1 == null ? val2
      : val2 == null ? val1
        : val2 > val1 ? val2
          : val1;
}

export const arrayExpressions: ReadonlyArray<Expression> = [
  {
    key: "count",
    expression: (array: any[]) => array.length
  },
  {
    key: "map",
    params: [
      { name: "array" },
      { name: "mapExpr", deferEvaluation: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], mapExpr: ExpressionScope) =>
      lambdaEvaluator(mapExpr, scope, fx => array.map(item => fx.evaluate(item)))
  },
  {
    key: "filter",
    params: [
      { name: "array" },
      { name: "filterExpr", deferEvaluation: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], filterExpr: ExpressionScope) =>
      lambdaEvaluator(filterExpr, scope, fx => array.filter(item => fx.evaluate(item)))
  },
  {
    key: "sort",
    params: [
      { name: "array" },
      { name: "valueExpr", deferEvaluation: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope, direction: "asc" | "desc") =>
      lambdaEvaluator(valueExpr, scope, fx => array.concat().sort((item1, item2) =>
        fx.evaluate(item1) < fx.evaluate(item2)
          ? (direction == null || direction === "asc" ? -1 : 1)
          : (direction == null || direction === "asc" ? 1 : -1))
      )
  },
  {
    key: "min",
    params: [
      { name: "array" },
      { name: "valueExpr", deferEvaluation: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope) => {
      let min: any = null;
      lambdaEvaluator(valueExpr, scope, fx => array.forEach(item => min =  minOf(min, fx.evaluate(item))));
      return min;
    }
  },
  {
    key: "max",
    params: [
      { name: "array" },
      { name: "valueExpr", deferEvaluation: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope) => {
      let max: any = null;
      lambdaEvaluator(valueExpr, scope, fx => array.forEach(item => max =  maxOf(max, fx.evaluate(item))));
      return max;
    }
  },
  {
    key: "avg",
    params: [
      { name: "array" },
      { name: "valueExpr", deferEvaluation: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope) => {
      let count = 0;
      let total = 0;
      lambdaEvaluator(valueExpr, scope, fx => array.forEach(item => {
        const val = fx.evaluate(item);
        if (val != null) {
          count++;
          total += val;
        }
      }));
      return count > 0 ? total / count : null;
    }
  }
];
