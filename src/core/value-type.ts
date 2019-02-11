import { isDate, isNumber, isBoolean, isString, isNull } from "lodash";

export type ValueType = number | string | boolean | Date | null;

export function isValueType(value: any): value is ValueType {
  return isNumber(value) || isString(value) || isBoolean(value) || isDate(value) || isNull(value);
}
