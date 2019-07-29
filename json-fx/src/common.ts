export function isString(value: any): value is string {
  return value != null && (typeof value == "string" || toString.call(value) == "[object String]");
}

export function isNumber(value: any): value is number {
  return value != null && (typeof value == "number" || toString.call(value) == "[object Number]");
}

export function isBoolean(value: any): value is boolean {
  return value != null && (typeof value == "boolean" || toString.call(value) == "[object Boolean]");
}

export function isArray(value: any): value is any[] {
  return value != null && Array.isArray(value);
}

export function isObject(value: any): value is { [index: string]: any } {
  return value != null && (toString.call(value) == "[object Object]");
}

export function isFunction(value: any): value is (...args: any[]) => any {
  const typeString = toString.call(value);
  return typeString == "[object Function]" || typeString == "[object AsyncFunction]" ||
    typeString == "[object GeneratorFunction]" || typeString == "[object Proxy]";
}

export function isEmpty(value: any): boolean {
  return value == null || (isArray(value) && !value.length) || (isObject(value) && !Object.keys(value).length);
}
