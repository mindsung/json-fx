export function isString(value: any): value is string {
  return value != null && (typeof value == "string" || toString.call(value) == "[object String]");
}

export function isNumber(value: any): value is number {
  return value != null && (typeof value == "number" || toString.call(value) == "[object Number]");
}

export function isArray(value: any): value is Array<any> {
  return value != null && Array.isArray(value);
}

export function isObject(value: any): boolean {
  return value != null && typeof value == "object";
}

export function isFunction(value: any): value is (...args: any[]) => any {
  const typeString = toString.call(value);
  return typeString == "[object Function]" || typeString == "[object AsyncFunction]" ||
    typeString == "[object GeneratorFunction]" || typeString == "[object Proxy]";
}

export function isEmpty(value: any): boolean {
  return value == null || (isArray(value) && !value.length) || (isObject(value) && !Object.keys(value).length);
}
