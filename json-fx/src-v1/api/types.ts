/** Where a node, token or error came from. `line`/`column` are 1-based within the expression string (0 = unknown). */
export interface SourceRef {
  /** JSON path of the template value, e.g. `lines[0].total`; empty for the root. */
  readonly path: string;
  readonly line: number;
  readonly column: number;
  /** The source text of the token the node was built from. */
  readonly symbol: string;
}

export interface FxOperatorDef {
  readonly symbol: string;
  /** Binding power on v0's numeric scale (`+` 3, `*` 3.1, `**` 3.2, `==` 2, `&&` 1.1, `||` 1). Ignored for unary operators. */
  readonly precedence: number;
  readonly assoc?: "left" | "right";
  /** Prefix unary operator. Prefix only: postfix operators don't exist in v1. */
  readonly isUnary?: boolean;
}

export interface FxParamDef {
  readonly name: string;
  readonly description?: string;
  readonly valueType?: "string" | "number" | "boolean" | "date" | "object" | "array";
}

/** Argument of a `deferEvaluation` function: evaluated only if and when the function asks for it. */
export interface FxLazyArg {
  evaluate(): any;
  readonly sourceRef: SourceRef;
}

/**
 * A function (optionally also an operator) templates can call. Source-compatible with v0's `FxExpressionDefinition`.
 */
export interface FxFunctionDef {
  readonly name: string;
  evaluate?: (...args: any[]) => any;
  readonly operator?: FxOperatorDef;
  /** Arguments arrive as `FxLazyArg`s instead of values. */
  readonly deferEvaluation?: boolean;
  readonly params?: readonly FxParamDef[];
  /**
   * No side effects and a result that depends only on the arguments: enables constant folding and hoisting.
   * Default `false` for extensions; built-ins declare it.
   */
  readonly pure?: boolean;
  /** Reserved (Phase 7). */
  readonly async?: boolean;
  /**
   * INTERNAL. Marks the built-ins the parser lowers to dedicated nodes (`&&`, `||` → `logical`, `ifElse` → `cond`).
   * Extensions must not set it; a redefinition of the name drops the marker along with the definition.
   */
  readonly intrinsic?: "and" | "or" | "ifElse";
  /**
   * INTERNAL. Inline JS for the code generator (V1-PLAN.md §5.8), only on built-ins. Receives the already generated
   * argument expressions (each self-delimiting) and returns an expression with exactly the semantics of `evaluate`,
   * using every argument exactly once and in order, or `undefined` to decline (e.g. a different argument count).
   * Extensions must not set it; redefining a built-in drops it along with the definition.
   */
  readonly emit?: (args: readonly string[]) => string | undefined;
}

export interface FxInput {
  name: string;
  value: any;
}

export interface CompileOptions {
  /** Declared input names (`'$'`, `'$order'`). Unknown `$names` are then compile errors instead of run-time lookups. */
  inputs?: readonly string[];
  /** Bare words in value position are compile errors instead of string constants. */
  strictIdentifiers?: boolean;
  /** Template name carried by runtime errors. */
  name?: string;
  /** Overrides the instance's backend for this template. */
  backend?: "codegen" | "closure";
}
