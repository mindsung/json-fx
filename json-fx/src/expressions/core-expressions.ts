import {Expression, ExpressionScope, ScopeVariable} from "../core/expression";

// Since all parameters are required to be expression scopes, we need a special
// case for creating expressions that returns a constant.
export function createExpressionConstant(value: any, vars?: ReadonlyArray<ScopeVariable>): ExpressionScope {
  return new ExpressionScope({
    key: "__const",
    expression: () => value
  }, null, vars);
}

export function createExpressionLambda(paramVarNames: string[], expr: ExpressionScope) {
  return new ExpressionScope({
    key: "*_lambda",
    expression: (...params: any[]) => {
      expr.vars = paramVarNames.map((n, i) => ({ name: n, expr: params[i] }));
      return expr.value;
    },
    params: paramVarNames.map(n => ({ name: n, deferEvaluation: true }))
  });
}

export const coreExpressions: ReadonlyArray<Expression> = [
  {
    key: "_var",
    expressionFactory: (scope: ExpressionScope) => (varName: string, ...params: ExpressionScope[]) => scope.getVariableValue(varName, params)
  },
  {
    key: "_varexpr",
    expressionFactory: (scope: ExpressionScope) => (varName: string, ...params: ExpressionScope[]) => scope.getVariableExpression(varName)
  },
  {
    key: "_prop",
    expression: (obj: any, propPath: string) => {
      let propValue = obj;
      let path = propPath != null ? (propPath || "") : "";
      if (path.startsWith(".")) {
        path = path.substring(1);
      }
      const parts = path.split(".").filter(p => p.length > 0);
      for (let i = 0; i < parts.length; i++) {
        propValue = propValue[parts[i]];
        if (propValue == null) {
          return null;
        }
      }
      return propValue;
    }
  },
  {
    key: "_object",
    expression: (map: Map<ExpressionScope<string>, ExpressionScope>): {} => {
      const value = {};
      map.forEach((v, k) => value[k.value] = v.value);
      return value;
    }
  },
  {
    key: "_array",
    expression: (array: ExpressionScope[]): any[] => array.map(x => x.value)
  }
];
