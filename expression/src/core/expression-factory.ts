import { Expression, isExpression } from "./expression";
import { ConstantExpression } from "../expressions/constant-expression";
import { PropertyExpression } from "../expressions/property-expression";
import { CaseExpression } from "../expressions/case-expression";
import { ArrayCountExpression } from "../expressions/array-count-expression";
import { ArrayFilterExpression } from "../expressions/array-filter-expression";
import { ArraySortExpression } from "../expressions/array-sort-expression";
import { ArrayMapExpression } from "../expressions/array-map-expression";
import { ArrayMinExpression } from "../expressions/array-min-expression";
import { ArrayMaxExpression } from "../expressions/array-max-expression";
import { ArrayAvgExpression } from "../expressions/array-avg-expression";
import {
  ObjectExpression,
  KeyValueExpressionPair
} from "../expressions/object-expression";
import { OutputTransformExpression } from "../expressions/output-transform-expression";
import { VariableExpression } from "../expressions/variable-expression";
import { isValueType, ValueType } from "./value-type";
import { isString } from "lodash";
import {
  LogicalEqualsExpression,
  LogicalNotEqualsExpression,
  LogicalGreaterThanExpression,
  LogicalGreaterThanOrEqualsExpression,
  LogicalLessThanExpression,
  LogicalLessThanOrEqualsExpression,
  LogicalAndExpression,
  LogicalOrExpression
} from "../expressions/logical-expressions";

interface ExpressionParamInfo {
  required?: boolean;
  description?: string;
}

interface ExpressionMapItem {
  type: any;
  isTransform: boolean;
  factory?: (params: any[]) => Expression<any>;
  paramsInfo?: { [key: string]: ExpressionParamInfo };
}

const expressionFactoryMap: { [key: string]: ExpressionMapItem } = {
  _transform: {
    type: OutputTransformExpression,
    isTransform: true,
    factory: (params: [any, any]) =>
      new OutputTransformExpression(
        isExpression(params[0]) ? params[0] : new ConstantExpression(params[0]),
        isExpression(params[1]) ? params[1] : new ConstantExpression(params[1])
      )
  },
  const: {
    type: ConstantExpression,
    isTransform: false,
    factory: params => new ConstantExpression(params[0])
  },
  object: {
    type: ObjectExpression,
    isTransform: false,
    factory: (params: [KeyValueExpressionPair[]]) => {
      const mappedKvs = params[0].map(kv => ({
        key: isString(kv.key) ? new ConstantExpression(kv.key) : kv.key,
        value: isValueType(kv.value)
          ? new ConstantExpression(kv.value)
          : kv.value
      }));
      return new ObjectExpression(mappedKvs);
    }
  },
  var: {
    type: VariableExpression,
    isTransform: false,
    factory: (params: [string]) => new VariableExpression(params[0])
  },
  prop: {
    type: PropertyExpression,
    isTransform: true
  },
  case: {
    type: CaseExpression,
    isTransform: false,
    factory: params => new CaseExpression(params[0], params[1])
  },
  eq: {
    type: LogicalEqualsExpression,
    isTransform: true
  },
  neq: {
    type: LogicalNotEqualsExpression,
    isTransform: true
  },
  gt: {
    type: LogicalGreaterThanExpression,
    isTransform: true
  },
  gte: {
    type: LogicalGreaterThanOrEqualsExpression,
    isTransform: true
  },
  lt: {
    type: LogicalLessThanExpression,
    isTransform: true
  },
  lte: {
    type: LogicalLessThanOrEqualsExpression,
    isTransform: true
  },
  and: {
    type: LogicalAndExpression,
    isTransform: true
  },
  or: {
    type: LogicalOrExpression,
    isTransform: true
  },
  count: {
    type: ArrayCountExpression,
    isTransform: true
  },
  filter: {
    type: ArrayFilterExpression,
    isTransform: true
  },
  sort: {
    type: ArraySortExpression,
    isTransform: true
  },
  map: {
    type: ArrayMapExpression,
    isTransform: true
  },
  min: {
    type: ArrayMinExpression,
    isTransform: true
  },
  max: {
    type: ArrayMaxExpression,
    isTransform: true
  },
  avg: {
    type: ArrayAvgExpression,
    isTransform: true
  }
};

function constMapParams(params: any[]) {
  return params.map(p => (isValueType(p) ? new ConstantExpression(p) : p));
}

export function createExpression(
  typeName: string,
  params: any[]
): Expression<any> {
  const item = expressionFactoryMap[typeName];
  if (item == null) {
    throw new Error(`Unknown expression type: ${typeName}`);
  }
  params = params || [];
  if (item.factory != null) {
    return item.factory(item.isTransform ? [null].concat(params) : params);
  } else {
    const applyParams = item.isTransform
      ? [null].concat(constMapParams(params))
      : constMapParams(params);
    return new (item.type.bind.apply(
      item.type,
      [item.type].concat(applyParams)
    ))() as Expression<any>;
  }
}

export function createExpressionWithInput(
  typeName: string,
  input: Expression<any>,
  params: any[]
): Expression<any> {
  const item = expressionFactoryMap[typeName];
  if (item == null) {
    throw new Error(`Unknown expression type: ${typeName}`);
  }
  params = params || [];
  if (item.factory != null) {
    return item.factory(item.isTransform ? [input].concat(params) : params);
  } else {
    const applyParams = item.isTransform
      ? constMapParams([input]).concat(constMapParams(params))
      : constMapParams(params);
    return new (item.type.bind.apply(
      item.type,
      [item.type].concat(applyParams)
    ))() as Expression<any>;
  }
}

export interface ExpressionVariable {
  name: string;
  value: ValueType | Expression<any>;
}

export function withScopeVariables(
  vars: ExpressionVariable[],
  expr: Expression<any>
) {
  vars
    .map(v => ({
      name: v.name,
      value: isValueType(v.value) ? new ConstantExpression(v.value) : v.value
    }))
    .forEach(v => expr.scope.addVariableExpression(v.name, v.value));
  return expr;
}
