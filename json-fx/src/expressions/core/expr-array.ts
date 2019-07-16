import { isArray, isNumber } from "../../common";
import { FxExpressionDefinition } from "../../compiler/lexer/model/fx-definition";
import { FxLambdaFn } from "../../defs";

export const exprArray: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "item",
    evaluate: (arr: any[] | any, index: number | string) => {
      return arr[index];
    }
  },
  {
    name: "map",
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      return arr.map(lambda);
    },
    operator: { symbol: "::", precedence: 4 }
  },
  {
    name: "sort",
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
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
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      return arr.filter(lambda);
    }
  },
  {
    name: "reduce",
    evaluate: (arr: any[], lambda: FxLambdaFn, identity: any) => {
      return arr.reduce(lambda, identity);
    }
  },
  {
    name: "find",
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      return arr.find(lambda);
    }
  },
  {
    name: "concat",
    evaluate: (a: any, b: any) => {
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
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      let min: any = null;
      arr.forEach(item => min = minOf(min, lambda ? lambda(item) : item));
      return min;
    }
  },
  {
    name: "max",
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      let max: any = null;
      arr.forEach(item => max = maxOf(max, lambda ? lambda(item) : item));
      return max;
    }
  },
  {
    name: "avg",
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      let total = 0;
      let count = 0;
      arr.forEach(item => {
        const itemVal = lambda ? lambda(item) : item;
        if (itemVal == null) { return; }
        if (!isNumber(itemVal)) {
          throw new Error("Values for evaluator 'avg' must be numeric or null.");
        }
        total += itemVal;
        count++;
      });
      return count ? (total / count) : null;
    }
  },
  {
    name: "withMin",
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      let min: any = null;
      let minItem: any = null;
      arr.forEach(item => {
        const itemVal = lambda ? lambda(item) : item;
        min = minOf(min, itemVal);
        if (itemVal === min) {
          minItem = item;
        }
      });
      return minItem;
    }
  },
  {
    name: "withMax",
    evaluate: (arr: any[], lambda: FxLambdaFn) => {
      let max: any = null;
      let maxItem: any = null;
      arr.forEach(item => {
        const itemVal = lambda ? lambda(item) : item;
        max = maxOf(max, itemVal);
        if (itemVal === max) {
          maxItem = item;
        }
      });
      return maxItem;
    }
  },
  {
    name: "length",
    evaluate: (arr: any[]) => arr.length
  },
  {
    name: "range",
    evaluate: (min: number, max: number) => {
      const result = [];
      for (let i = min; i < max; i++) {
        result.push(i);
      }
      return result;
    }
  }
];

function minOf(val1: any, val2: any): any {
  return val1 == null && val2 == null ? null
    : val1 == null ? val2
      : val2 == null ? val1
        : val2 < val1 ? val2
          : val1;
}

function maxOf(val1: any, val2: any): any {
  return val1 == null && val2 == null ? null
    : val1 == null ? val2
      : val2 == null ? val1
        : val2 > val1 ? val2
          : val1;
}
