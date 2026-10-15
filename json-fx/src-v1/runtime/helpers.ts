import type { FxLazyArg, SourceRef } from "../api/types";
import { FxError, FxRuntimeError } from "../errors";

/**
 * Runtime helpers shared by the backends (V1-PLAN.md §5.10). Everything that touches template-controlled keys goes
 * through here so the §4.6 hardening lives in one place:
 *  - reads of `__proto__`, `constructor` and `prototype` give `undefined`;
 *  - a function value is only readable when it is an own property of the object it was read from.
 */

const hasOwn = Object.prototype.hasOwnProperty;

export function isBlockedKey(key: unknown): boolean {
  return key === "__proto__" || key === "constructor" || key === "prototype";
}

/**
 * Property keys are strings, numbers or symbols; anything else would be coerced by `obj[key]` *after* the blocked-key
 * check (an object whose `toString` returns `'constructor'`), so it is coerced first.
 */
export function toKey(key: unknown): string | number | symbol {
  const t = typeof key;
  return t === "string" || t === "number" || t === "symbol" ? (key as string | number | symbol) : String(key);
}

function nullReceiver(o: null | undefined, key: unknown): TypeError {
  return new TypeError(`Cannot read properties of ${o} (reading '${String(key)}')`);
}

/** `o[key]` with the hardening rules. Throws like JS for a null or undefined receiver. */
export function get(o: any, key: string | number | symbol): any {
  if (o == null) { throw nullReceiver(o, key); }
  if (typeof key === "string" && isBlockedKey(key)) { return undefined; }
  const v = o[key];
  if (typeof v === "function" && !hasOwn.call(o, key)) { return undefined; }
  return v;
}

/** Same as `get` for a key that is only known at run time. */
export function getDynamic(o: any, key: unknown): any {
  return get(o, toKey(key));
}

/** The receiver check of a statically blocked key such as `.constructor`: undefined, but still a TypeError for null. */
export function getBlocked(o: any, key: string): undefined {
  if (o == null) { throw nullReceiver(o, key); }
  return undefined;
}

/** `o[k1, k2, …]` */
export function index(o: any, keys: readonly unknown[]): any[] {
  const out = new Array(keys.length);
  for (let i = 0; i < keys.length; i++) { out[i] = getDynamic(o, keys[i]); }
  return out;
}

/** Defines an own, enumerable data property (also for `__proto__`, which plain assignment would turn into a prototype change). */
export function setOwn(target: Record<string | number | symbol, unknown>, key: string | number | symbol, value: unknown): void {
  if (key === "__proto__") {
    Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
  } else {
    target[key] = value;
  }
}

/** `o{k1, k2}`: a new object with those keys. Blocked keys are omitted (owner decision, 2026-10-15). */
export function pick(o: any, keys: readonly unknown[]): Record<string, unknown> {
  if (o == null) { throw nullReceiver(o, keys.length ? keys[0] : ""); }
  const out: Record<string, unknown> = {};
  for (const raw of keys) {
    const key = toKey(raw);
    if (typeof key === "string" && isBlockedKey(key)) { continue; }
    out[key as string] = get(o, key);
  }
  return out;
}

/** What a dynamic key `{ source as $v, $k }` iterates: one entry per output key. */
export interface DynamicEntry {
  readonly key: string;
  readonly value: unknown;
  readonly index: unknown;
}

const toStr = Object.prototype.toString;

/**
 * Expands the source of a dynamic key (V1-PLAN.md §5.4 item 5): an array gives one key per item (`$v` = item, `$k` =
 * index), an object one per own key (`$v` = value, `$k` = key), any other value a single key `String(value)`
 * (`$k` = 0).
 */
export function dynamicEntries(source: unknown): DynamicEntry[] {
  if (Array.isArray(source)) {
    return source.map((item, i) => ({ key: String(item), value: item, index: i }));
  }
  if (source !== null && typeof source === "object" && toStr.call(source) === "[object Object]") {
    return Object.keys(source).map(k => ({ key: k, value: (source as Record<string, unknown>)[k], index: k }));
  }
  return [{ key: String(source), value: source, index: 0 }];
}

/** `$name` that was neither declared nor supplied. */
export function missing(name: string, src: SourceRef): FxRuntimeError {
  return new FxRuntimeError(`Undefined variable "${name}"`, src);
}

/**
 * Turns anything thrown during evaluation into an `FxRuntimeError` carrying the nearest source reference, keeping the
 * original as `cause`. The innermost reference wins: an error that already has one passes through unchanged.
 */
export function wrap(error: unknown, src: SourceRef): FxError {
  if (error instanceof FxError && error.sourceRef) { return error; }
  if (error instanceof FxError && !(error instanceof FxRuntimeError)) { return error; }
  const message = error instanceof Error ? error.message : String(error);
  return new FxRuntimeError(message, src, { cause: error });
}

/** The argument of a `deferEvaluation` function. */
export function lazyArg(thunk: () => unknown, src: SourceRef): FxLazyArg {
  return { evaluate: thunk, sourceRef: src };
}
