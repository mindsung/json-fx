import { Expression, ExpressionScope, ScopeVariable } from "../core/expression";
import { isEmpty, isObject } from "../core/common";

// Since all parameters are required to be expression scopes, we need a special
// case for creating module that returns a constant.
export function createExpressionConstant(value: any, vars: ScopeVariable[] = []): ExpressionScope {
  return new ExpressionScope({
    key: "_const",
    expression: () => value
  }).withVars(vars);
}

export function createExpressionLambda(paramVarNames: string[], expr: ExpressionScope) {
  const origScopeVars = expr.vars.concat();
  return new ExpressionScope({
    key: "*_lambda",
    expression: (...params: any[]) => {
      expr.vars = origScopeVars.concat(paramVarNames.map((n, i) => ({ name: n, expr: params[i] })));
      return expr.value;
    },
    params: paramVarNames.map(n => ({ name: n, deferEvaluation: true }))
  });
}

export const fxCoreExpressions: ReadonlyArray<Expression> = [
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
        if (propValue == null) {
          throw new Error(`Cannot evaluate property "${parts[i]}" of null.`);
        }
        propValue = propValue[parts[i]];
      }
      return propValue;
    }
  },
  {
    key: "_object",
    expression: (props: ObjectExpressionProperty[]): {} => {
      const obj = {};
      props.forEach(p => {
        const value = p.valueExpr.value;
        if (!p.isOptional || !(value == null || (isObject(value) && isEmpty(value)))) {
          obj[p.keyExpr.value] = value;
        }
      });
      return obj;
    }
  },
  {
    key: "_array",
    expression: (exprArray: ExpressionScope[]): any[] => exprArray.map(x => x.value)
  }
];

export interface ObjectExpressionProperty {
  keyExpr: ExpressionScope<string>;
  valueExpr: ExpressionScope;
  isOptional: boolean;
}
