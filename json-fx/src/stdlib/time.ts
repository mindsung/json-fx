import type { FxFunctionDef } from "../api/types";

/**
 * Formats `d` as local ISO 8601 with a UTC offset. `tzOffsetMins` follows `Date.getTimezoneOffset()`: minutes *west*
 * of UTC (so -60 is +01:00). Defaults to the host's offset at that date.
 */
function toISOLocalDateTime(d: Date, tzOffsetMins?: number): string {
  const offset = tzOffsetMins == null ? d.getTimezoneOffset() : tzOffsetMins;
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, -1) + (offset <= 0 ? "+" : "-") + hh + ":" + mm;
}

// Note for the optimizer: `dateTime` returns a mutable Date, so a folded result must not be shared across evaluations.
export const time: readonly FxFunctionDef[] = [
  { name: "now", evaluate: () => new Date() },
  { name: "dateTime", pure: true, evaluate: (val) => new Date(val) },
  { name: "toISODateTime", pure: true, evaluate: (val) => new Date(val).toISOString() },
  { name: "toISOLocalDateTime", pure: true, evaluate: (val, offsetMinutes) => toISOLocalDateTime(new Date(val), offsetMinutes) }
];
