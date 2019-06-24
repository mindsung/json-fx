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
    name: "min",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      let min: any = null;
      arr.forEach(item => min = minOf(min, lambda ? lambda(item) : item));
      return min;
    }
  },
  {
    name: "max",
    expression: (arr: any[], lambda: FxLambdaFn) => {
      let max: any = null;
      arr.forEach(item => max = maxOf(max, lambda ? lambda(item) : item));
      return max;
    }
  },
  {
    name: "length",
    expression: (arr: any[]) => arr.length
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
