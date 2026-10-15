import type { FxFunctionDef } from "../api/types";
import { isArray, isNumber, isObject, type AnyFn } from "./util";

function minOf(a: any, b: any): any {
  return a == null && b == null ? null : a == null ? b : b == null ? a : b < a ? b : a;
}

function maxOf(a: any, b: any): any {
  return a == null && b == null ? null : a == null ? b : b == null ? a : b > a ? b : a;
}

/**
 * Stable sort by a key: keys are computed once per element (B13), the comparator is consistent (-1/0/1) and ties keep
 * the input order. Without a key function this is JS's default sort (string order), as in v0.
 */
function sortBy(arr: any[], lambda?: AnyFn): any[] {
  if (!lambda) { return arr.slice().sort(); }
  const keyed = arr.map((value, index) => ({ value, index, key: lambda(value) }));
  keyed.sort((a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : a.index - b.index));
  return keyed.map(k => k.value);
}

export const collection: readonly FxFunctionDef[] = [
  { name: "assign", pure: true, evaluate: (...objects: any[]) => Object.assign({}, ...objects) },
  { name: "map", pure: true, evaluate: (arr: any[], lambda: AnyFn) => arr.map(lambda) },
  { name: "sort", pure: true, evaluate: sortBy },
  { name: "reverse", pure: true, evaluate: (arr: any[]) => arr.slice().reverse() },
  { name: "indexOf", pure: true, evaluate: (arr: any[], value: any) => (isArray(arr) ? arr.indexOf(value) : undefined) },
  { name: "findIndex", pure: true, evaluate: (arr: any[], lambda: AnyFn) => (isArray(arr) && lambda ? arr.findIndex(lambda) : undefined) },
  {
    name: "filter",
    pure: true,
    evaluate: (value: any, lambda: AnyFn) => {
      if (isArray(value)) {
        return value.filter(lambda);
      }
      if (isObject(value)) {
        return Object.keys(value).reduce((obj: Record<string, any>, key) => {
          if (lambda(key, value[key])) { obj[key] = value[key]; }
          return obj;
        }, {});
      }
      return undefined;
    }
  },
  { name: "reduce", pure: true, evaluate: (arr: any[], lambda: AnyFn, identity: any) => arr.reduce(lambda, identity) },
  { name: "find", pure: true, evaluate: (arr: any[], lambda: AnyFn) => arr.find(lambda) },
  { name: "slice", pure: true, evaluate: (arr: any[], startIndex: number, stopIndex: number) => arr.slice(startIndex, stopIndex) },
  {
    name: "splice",
    pure: true,
    evaluate: (arr: any[], startIndex: number, deleteCount: number, ...addItems: any[]) => {
      const copy = arr.slice();
      copy.splice(startIndex, deleteCount, ...addItems);
      return copy;
    }
  },
  {
    name: "concat",
    pure: true,
    evaluate: (a: any, ...other: any[]) => {
      const first: any[] = a == null ? [] : isArray(a) ? a : [a];
      const rest = other.filter(o => o != null).map(o => (isArray(o) ? o : [o]));
      return first.concat(...rest);
    }
  },
  {
    name: "min",
    pure: true,
    evaluate: (arr: any[], lambda?: AnyFn) => {
      let min: any = null;
      arr.forEach(item => { min = minOf(min, lambda ? lambda(item) : item); });
      return min;
    }
  },
  {
    name: "findMin",
    pure: true,
    evaluate: (arr: any[], lambda?: AnyFn) => {
      let min: any = null;
      let minItem: any = null;
      arr.forEach(item => {
        const itemVal = lambda ? lambda(item) : item;
        min = minOf(min, itemVal);
        if (itemVal === min) { minItem = item; }
      });
      return minItem;
    }
  },
  {
    name: "max",
    pure: true,
    evaluate: (arr: any[], lambda?: AnyFn) => {
      let max: any = null;
      arr.forEach(item => { max = maxOf(max, lambda ? lambda(item) : item); });
      return max;
    }
  },
  {
    name: "findMax",
    pure: true,
    evaluate: (arr: any[], lambda?: AnyFn) => {
      let max: any = null;
      let maxItem: any = null;
      arr.forEach(item => {
        const itemVal = lambda ? lambda(item) : item;
        max = maxOf(max, itemVal);
        if (itemVal === max) { maxItem = item; }
      });
      return maxItem;
    }
  },
  {
    name: "avg",
    pure: true,
    evaluate: (arr: any[], lambda?: AnyFn) => {
      let total = 0;
      let count = 0;
      arr.forEach(item => {
        const itemVal = lambda ? lambda(item) : item;
        if (itemVal == null) { return; }
        if (!isNumber(itemVal)) { throw new Error("Values for evaluator 'avg' must be numeric or null."); }
        total += itemVal;
        count++;
      });
      return count ? total / count : null;
    }
  },
  { name: "length", pure: true, evaluate: (arr: any[]) => arr.length },
  {
    // Note for the optimizer: `range(0, 1e9)` is "pure" but must not be folded at compile time.
    name: "range",
    pure: true,
    evaluate: (min: number, max: number, incr?: number) => {
      const result: number[] = [];
      for (let i = min; i < max; i += incr || 1) { result.push(i); }
      return result;
    }
  },
  { name: "item", pure: true, evaluate: (arr: any[], index: number) => arr[index] },
  { name: "first", pure: true, evaluate: (arr: any[]) => (arr != null && arr.length > 0 ? arr[0] : undefined) },
  { name: "last", pure: true, evaluate: (arr: any[]) => (arr != null && arr.length > 0 ? arr[arr.length - 1] : undefined) }
];
