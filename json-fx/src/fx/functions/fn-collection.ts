import { isArray, isNumber, isObject } from "../../common";
import { AnyFn, FxExpressionDefinition } from "../../model/fx-definition";

export const FnCollection: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "assign",
    evaluate: (...objects: any[]) => {
      return Object.assign({}, ...objects);
    }
  },
  {
    name: "map",
    evaluate: (arr: any[], lambda: AnyFn) => {
      return arr.map(lambda);
    },
  },
  {
    name: "sort",
    evaluate: (arr: any[], lambda: AnyFn) => {
      if (lambda) {
        return arr.slice().sort((a, b) => {
          const evalA = lambda(a);
          const evalB = lambda(b);

          return evalA > evalB ? 1 : -1;
        });
      } else {
        return arr.slice().sort();
      }
    }
  },
  {
    name: "reverse",
    evaluate: (arr: any[]) => arr.slice().reverse()
  },
  {
    name: "indexOf",
    evaluate: (arr: any[], value: any) => {
      if (isArray(arr)) {
        return arr.indexOf(value);
      }
    }
  },
  {
    name: "findIndex",
    evaluate: (arr: any[], lambda: AnyFn) => {
      if (isArray(arr)) {
        if (lambda) {
          return arr.findIndex(lambda);
        }
      }
    }
  },
  {
    name: "filter",
    evaluate: (value: any, lambda: AnyFn) => {
      if (isArray(value)) {
        return value.filter(lambda);
      } else if (isObject(value)) {
        return Object.keys(value).reduce((obj, key) => {
          if (lambda(key, value[key])) {
            obj[key] = value[key];
          }
          return obj;
        }, {});
      }
    }
  },
  {
    name: "reduce",
    evaluate: (arr: any[], lambda: AnyFn, identity: any) => {
      return arr.reduce(lambda, identity);
    }
  },
  {
    name: "find",
    evaluate: (arr: any[], lambda: AnyFn) => {
      return arr.find(lambda);
    }
  },
  {
    name: "slice",
    evaluate: (arr: any[], startIndex: number, stopIndex: number) => arr.slice(startIndex, stopIndex)
  },
  {
    name: "splice",
    evaluate: (arr: any[], startIndex: number, deleteCount: number, ...addItems: any[]) => {
      const copy = arr.slice();
      copy.splice(startIndex, deleteCount, ...addItems);
      return copy;
    }
  },
  {
    name: "concat",
    evaluate: (a: any, ...other: any[]) => {
      if (!isArray(a)) {
        a = [a];
      }
      for (let i = 0; i < other.length; i++) {
        if (!isArray(other[i])) {
          other[i] = [other[i]];
        }
      }

      return a.concat(...other);
    }
  },
  {
    name: "min",
    evaluate: (arr: any[], lambda: AnyFn) => {
      let min: any = null;
      arr.forEach(item => min = minOf(min, lambda ? lambda(item) : item));
      return min;
    }
  },
  {
    name: "findMin",
    evaluate: (arr: any[], lambda: AnyFn) => {
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
    name: "max",
    evaluate: (arr: any[], lambda: AnyFn) => {
      let max: any = null;
      arr.forEach(item => max = maxOf(max, lambda ? lambda(item) : item));
      return max;
    }
  },
  {
    name: "findMax",
    evaluate: (arr: any[], lambda?: AnyFn) => {
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
    name: "avg",
    evaluate: (arr: any[], lambda?: AnyFn) => {
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
    name: "length",
    evaluate: (arr: any[]) => arr.length
  },
  {
    name: "range",
    evaluate: (min: number, max: number, incr: number) => {
      const result = [];
      for (let i = min; i < max; i += (incr || 1)) {
        result.push(i);
      }
      return result;
    }
  },
  {
    name: "item",
    evaluate: (arr: any[], index: number) => arr[index]
  },
  {
    name: "first",
    evaluate: (arr: any[]) => arr != null && arr.length > 0 ? arr[0] : undefined
  },
  {
    name: "last",
    evaluate: (arr: any[]) => arr != null && arr.length > 0 ? arr[arr.length - 1] : undefined
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
