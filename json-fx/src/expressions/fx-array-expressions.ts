import { Expression, ExpressionScope } from "../core/expression";
import { createExpressionLambda, createExpressionConstant } from "./fx-core-expressions";
import { isArray } from "../core/common";

function lambdaEvaluator(expr: ExpressionScope, parentScope: ExpressionScope, callback: (evaluator: { evaluate: (item: any) => any }) => any) {
  const lambda = createExpressionLambda(["$"], expr);
  if (parentScope) {
    parentScope.addToScope(lambda);
  }
  return callback({
    evaluate: (item: any) => {
      lambda.params = [createExpressionConstant(item)];
      return lambda.value;
    }
  });
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

function flatten(arr: any[], recursive?: boolean) {
  let result = [];
  recursive = recursive || false;

  for (const item of arr) {
    if (isArray(item)) {
      result = result.concat(recursive ? flatten(item, recursive) : item);
    } else {
      result.push(item);
    }
  }

  return result;
}

function map(scope: ExpressionScope) {
  return (array: any[], mapExpr: ExpressionScope) =>
    lambdaEvaluator(mapExpr, scope, fx => array.map(item => fx.evaluate(item)));
}

export const fxArrayExpressions: ReadonlyArray<Expression> = [
  {
    key: "length",
    expression: (array: any[]) => array.length
  },
  {
    key: "at",
    expression: (array: any[], index: number) => array[index]
  },
  {
    key: "flatten",
    expression: (array: any[], recursive?: boolean) => flatten(array, recursive)
  },
  {
    key: "map",
    params: [
      { name: "array" },
      { name: "mapExpr", deferEvaluation: true }
    ],
    expressionFactory: map
  },
  {
    key: "field",
    expression: (array: any[], field: string) => array.map(value => value[field] || null),
    operator: { key: "..", precedence: 4 }
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
    key: "find",
    params: [
      { name: "array" },
      { name: "findExpr", deferEvaluation: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], findExpr: ExpressionScope) =>
      lambdaEvaluator(findExpr, scope, fx => {
        const found = array.filter(item => fx.evaluate(item));
        if (found.length > 1) {
          throw new Error(":find expression resulted in more than one matching item.");
        }
        return found.length === 1 ? found[0] : null;
      })
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
      lambdaEvaluator(valueExpr, scope, fx => array.forEach(item => min = minOf(min, fx.evaluate(item))));
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
      lambdaEvaluator(valueExpr, scope, fx => array.forEach(item => max = maxOf(max, fx.evaluate(item))));
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
