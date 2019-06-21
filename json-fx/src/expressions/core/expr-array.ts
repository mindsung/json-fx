import {FxExpressionDefinition, FxLambdaFn} from "../../defs";
import {isArray} from "../../common";

export const exprArray: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "item",
    expression: (arr: any[], index: number) => {
      return arr[index];
    }
  },
  {
    name: "map",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      return arr.map(lambda);
    },
    operator: {symbol: "::", precedence: 4}
  },
  {
    name: "sort",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      if (lambda) {
        return arr.sort((a, b) => {
          const evalA = lambda(a);
          const evalB = lambda(b);

          return evalA > evalB ? 1 : -1;
        });
      } else {
        return arr.sort();
      }
    }
  },
  {
    name: "filter",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      return arr.filter(lambda);
    }
  },
  {
    name: "find",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      return arr.find(lambda);
    }
  },
  {
    name: "concat",
    expression: (a: any, b: any) => {
      if (!isArray(a)) {
        a = [a];
      }
      if (!isArray(b)) {
        b = [b];
      }

      return a.concat(b);
    }
  },
  {
    name: "field",
    operator: { symbol: "..", precedence: 4 },
    expression: (arr: any[], field: string) => {
      return arr.map(item => item[field] || undefined).filter(item => item != undefined);
    }
  },
  {
    name: "min",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      let min: any = null;
      arr.forEach(item => min = minOf(min, lambda(item)));
      return min;
    }
  },
  {
    name: "max",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      let max: any = null;
      arr.forEach(item => max = maxOf(max, lambda(item)));
      return max;
    }
  },
  {
    name: "length",
    expression: (arr: any[]) => arr.length
  },
  {
    name: "exec",
    expression: (arr: FxLambdaFn[], ...params: any) => {
      if (arr.length == 0) {
        return null;
      } else {
        let output = arr[0](...params);

        for (let i = 1; i < arr.length; i++) {
          output = arr[i](output);
        }

        return output;
      }
    }
  }
];

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
