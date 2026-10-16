import type { SourceRef } from "./api/types";

/** The ` (at path, line L, column C)` suffix `FxError` appends to its message. */
export function describe(ref: SourceRef | undefined): string {
  if (!ref) { return ""; }
  const parts: string[] = [];
  if (ref.path) { parts.push(`at ${ref.path}`); }
  if (ref.line > 0) { parts.push(`line ${ref.line}, column ${ref.column}`); }
  return parts.length ? ` (${parts.join(", ")})` : "";
}

/** Base class of every error json-fx throws. `name` is the concrete class name. */
export class FxError extends Error {
  public readonly sourceRef: SourceRef | undefined;
  /** `CompileOptions.name` of the template the error came from; set when a compiled template rethrows it. */
  public templateName: string | undefined;

  constructor(message: string, sourceRef?: SourceRef, options?: { cause?: unknown }) {
    super(message + describe(sourceRef), options);
    this.name = new.target.name;
    this.sourceRef = sourceRef;
  }
}

/** The template text is not valid JSON-fx. */
export class FxSyntaxError extends FxError {}

/** The template parses but can't be compiled: unknown function, bad arity, cyclic variables, mixed `()` output, … */
export class FxCompileError extends FxError {}

/** Anything thrown while evaluating a compiled template. */
export class FxRuntimeError extends FxError {}
