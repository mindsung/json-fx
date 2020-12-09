import { FxExpressionDefinition } from "../../model/fx-definition";

export const FnTime: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "now",
    evaluate: () => new Date()
  },
  {
    name: "dateTime",
    evaluate: val => new Date(val)
  },
  {
    name: "toISODateTime",
    evaluate: val => new Date(val).toISOString()
  },
  {
    name: "toISOLocalDateTime",
    evaluate: (val, offsetMinutes) => toISOLocalDateTime(new Date(val), offsetMinutes)
  }
];

function toISOLocalDateTime(d: Date, tzOffsetMins?: number): string {
  if (tzOffsetMins == null) {
    tzOffsetMins = new Date().getTimezoneOffset();
  }
  let offsetHours = Math.floor(Math.abs(tzOffsetMins / 60)).toString();
  let offsetMins = Math.abs(tzOffsetMins % 60).toString();

  if (offsetHours.length === 1) { offsetHours = "0" + offsetHours; }
  if (offsetMins.length === 1) { offsetMins = "0" + offsetMins; }

  return (new Date(Date.now() - (tzOffsetMins * 60000))).toISOString().slice(0, -1)
  + (tzOffsetMins <= 0 ? "+" : "-") + offsetHours + ":" + offsetMins;
}
