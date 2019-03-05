import {Expression, ExpressionScope} from "../expression";
import {createExpressionLambda, createExpressionConstant} from "./core-expressions";

// function createItemScope(parentScope: ExpressionScope, expr: ExpressionScope, item: any): ExpressionScope {
//   const itemScope = createExpressionConstant(item);
//   const nullScope = createExpressionConstant(null, [{ name: "$", scope: itemScope}]);
//   expr.reset();
//   nullScope.addToScope(expr);
//   if (parentScope) {
//     parentScope.addToScope(nullScope);
//   }
//   return nullScope;
// }

function exprItemValue(parentScope: ExpressionScope, expr: ExpressionScope, item: any): any {
  const itemScope = createExpressionLambda(["$"], expr);
  parentScope.addToScope(itemScope);
  itemScope.params = [createExpressionConstant(item)];
  return itemScope.value;
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
      { name: "mapExpr", requireExpression: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], mapExpr: ExpressionScope) =>
      array.map(item => exprItemValue(scope, mapExpr, item))
  },
  {
    key: "filter",
    params: [
      { name: "array" },
      { name: "filterExpr", requireExpression: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], filterExpr: ExpressionScope) =>
      array.filter(item => exprItemValue(scope, filterExpr, item))
  },
  {
    key: "sort",
    params: [
      { name: "array" },
      { name: "valueExpr", requireExpression: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope, direction: "asc" | "desc") =>
      array.concat().sort((item1, item2) =>
        exprItemValue(scope, valueExpr, item1) < exprItemValue(scope, valueExpr, item2)
          ? (direction == null || direction === "asc" ? -1 : 1)
          : (direction == null || direction === "asc" ? 1 : -1))
  },
  {
    key: "min",
    params: [
      { name: "array" },
      { name: "valueExpr", requireExpression: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope) => {
      let min: any = null;
      array.forEach(item => min = minOf(min, exprItemValue(scope, valueExpr, item)));
      return min;
    }
  },
  {
    key: "max",
    params: [
      { name: "array" },
      { name: "valueExpr", requireExpression: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope) => {
      let min: any = null;
      array.forEach(item => min = maxOf(min, exprItemValue(scope, valueExpr, item)));
      return min;
    }
  },
  {
    key: "avg",
    params: [
      { name: "array" },
      { name: "valueExpr", requireExpression: true }
    ],
    expressionFactory: (scope: ExpressionScope) => (array: any[], valueExpr: ExpressionScope) => {
      let count = 0;
      let total = 0;
      array.forEach(item => {
        const val = exprItemValue(scope, valueExpr, item);
        if (val != null) {
          count++;
          total += val;
        }
      });
      return count > 0 ? total / count : null;
    }
  }
];
