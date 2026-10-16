import type { LiteralValue } from "../../syntax/ast";

/**
 * Everything the code generator derives from template or host text goes through this module (V1-PLAN.md §4.6 item 3):
 *  - identifiers come from `Names` and never contain template text;
 *  - string and number literals and property keys are produced by `str`, `num`, `literal`, `propKey` and `member`;
 *  - the template name only reaches the output through `sanitizeName`.
 * `codegen.ts` adds fixed syntax around these pieces. The functions here return *self-delimiting* expressions
 * (an identifier, literal, call, member access or parenthesized form) so callers never think about precedence.
 */

/** Allocates generator-made identifiers: a prefix plus a counter (`p3`, `v7`, `t12`). */
export class Names {
  private n = 0;

  public id(prefix: string): string {
    return prefix + this.n++;
  }
}

// Written with escapes on purpose: a raw U+2028 in this file would end the line inside the regex literal.
const UNSAFE_CHARS = new RegExp("[\\u2028\\u2029<>&]", "g");

/** A JS string literal for `s`: `JSON.stringify`, plus the characters JSON leaves raw that are unsafe in some embeddings. */
export function str(s: string): string {
  return JSON.stringify(s).replace(UNSAFE_CHARS, c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
}

/** A number literal; negative numbers and `-0` are parenthesized so `a - -1` and `(-1).x` can't go wrong. */
export function num(n: number): string {
  if (Number.isNaN(n)) { return "NaN"; }
  if (n === Infinity) { return "Infinity"; }
  if (n === -Infinity) { return "(-Infinity)"; }
  if (Object.is(n, -0)) { return "(-0)"; }
  return n < 0 ? `(${n})` : String(n);
}

export function literal(value: LiteralValue): string {
  switch (typeof value) {
    case "string": return str(value);
    case "number": return num(value);
    case "boolean": return value ? "true" : "false";
    case "undefined": return "(void 0)";
    default: return "null";
  }
}

/** A property key in an object literal. `__proto__` must be computed or it would set the prototype instead. */
export function propKey(key: string): string {
  return key === "__proto__" ? `[${str(key)}]` : str(key);
}

/** A key known at generation time, as an expression. */
export function keyLiteral(key: string | number): string {
  return typeof key === "number" ? num(key) : str(key);
}

/** `recv[key]` for a key known at generation time. */
export function member(recv: string, key: string | number): string {
  return `${recv}[${keyLiteral(key)}]`;
}

/** An expression usable as the receiver of `.name`: bare number literals need parentheses (`5.toString()` is a syntax error). */
function receiver(expr: string): string {
  return /^[\d.]/.test(expr) ? `(${expr})` : expr;
}

/** A function name for the generated factory and the `//# sourceURL` comment: letters, digits, `_`, `.` and `-` only. */
export function sanitizeName(name: string | undefined): string {
  const safe = (name ?? "").replace(/[^A-Za-z0-9_.-]/g, "_").slice(0, 80);
  return safe || "template";
}

/** The identifier of the generated function (`template_<name>`), valid for any template name. */
export function factoryName(name: string | undefined): string {
  return "template_" + sanitizeName(name).replace(/[^A-Za-z0-9_]/g, "_");
}

/** Builders for `FxFunctionDef.emit`: inline forms with exactly the semantics of the built-in's `evaluate`. */
export const inline = {
  /** `(a op b)`, for a function that is exactly `(a, b) => a op b`. */
  binary: (op: string) => (a: readonly string[]): string | undefined => (a.length === 2 ? `(${a[0]} ${op} ${a[1]})` : undefined),
  /** `(op a)`, for a function that is exactly `(a) => op a`. */
  unary: (op: string) => (a: readonly string[]): string | undefined => (a.length === 1 ? `(${op}${a[0]})` : undefined),
  /**
   * `a.name()`, for a function that is exactly `(a) => a.name()`. Only without further arguments: `a.name(b)` would
   * read `a.name` (and throw for a null receiver) *before* evaluating `b`, while the call through `evaluate` evaluates
   * all arguments first, so which error a template reports could change.
   */
  method: (name: string) => (a: readonly string[]): string | undefined =>
    (a.length === 1 ? `${receiver(a[0] as string)}.${name}()` : undefined),
  /** `a.name`, for a function that is exactly `(a) => a.name`. */
  property: (name: string) => (a: readonly string[]): string | undefined => (a.length === 1 ? `${receiver(a[0] as string)}.${name}` : undefined),
  /** `Math.name(args…)` for any argument count: the Math functions are called with their arguments as given. */
  /** `Math.NAME`, for a zero-argument function that returns that constant. */
  mathConstant: (name: string) => (a: readonly string[]): string | undefined => (a.length === 0 ? `Math.${name}` : undefined),
  math: (name: string) => (a: readonly string[]): string | undefined => `Math.${name}(${a.join(", ")})`
};
