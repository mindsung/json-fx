const toStr = Object.prototype.toString;

export type AnyFn = (...args: any[]) => any;

export const isNumber = (v: unknown): v is number => v != null && (typeof v === "number" || toStr.call(v) === "[object Number]");
export const isArray = (v: unknown): v is any[] => Array.isArray(v);
export const isObject = (v: unknown): v is Record<string, any> => v != null && toStr.call(v) === "[object Object]";
