import type { FxFunctionDef, SourceRef } from "../api/types";

/** Placeholder until the resolver (Phase 3) defines scopes. */
export interface ScopeInfo {
  readonly id: number;
}

export interface Binding {
  readonly scope: ScopeInfo;
  readonly kind: "input" | "global" | "var" | "fn" | "param";
  readonly slot: number;
}

/** A registered function by name. `def` is absent when the name isn't registered (the resolver reports that). */
export interface FnRef {
  readonly name: string;
  readonly def: FxFunctionDef | undefined;
}

export interface OpRef extends FnRef {
  readonly symbol: string;
}

export interface Param {
  /** Including the sigil: `$x` (value) or `@f` (callable). */
  readonly name: string;
  readonly callable: boolean;
}

interface Base {
  readonly src: SourceRef;
}

export type LiteralValue = string | number | boolean | null | undefined;

export interface LiteralNode extends Base {
  readonly kind: "literal";
  readonly value: LiteralValue;
  /** The literal came from an unregistered identifier in value position (`"kind": "order"`). */
  readonly bareWord?: boolean;
}
/** `$x` / `@f` in value position. `name` includes the sigil. */
export interface RefNode extends Base { readonly kind: "ref"; readonly name: string; binding?: Binding; }
export interface ArrayNode extends Base { readonly kind: "array"; readonly items: Node[]; }
export interface ObjectNode extends Base {
  readonly kind: "object";
  readonly decls: Decl[];
  readonly fields: Field[];
  /** Value of the `()` key: the object evaluates to this instead of to its fields. */
  readonly output?: Node;
  scope?: ScopeInfo;
}
export interface LambdaNode extends Base { readonly kind: "lambda"; readonly params: Param[]; readonly body: Node; scope?: ScopeInfo; }
/** Call of a registered function. */
export interface CallNode extends Base { readonly kind: "call"; readonly fn: FnRef; readonly args: Node[]; }
/** Call of a user function or callable parameter: `@f(x)`. */
export interface ApplyNode extends Base { readonly kind: "apply"; readonly callee: Node; readonly args: Node[]; }
export interface ChainNode extends Base { readonly kind: "chain"; readonly base: Node; readonly steps: Step[]; }
export interface UnaryNode extends Base { readonly kind: "unary"; readonly op: OpRef; readonly operand: Node; }
export interface BinaryNode extends Base { readonly kind: "binary"; readonly op: OpRef; readonly left: Node; readonly right: Node; }
export interface LogicalNode extends Base { readonly kind: "logical"; readonly op: "&&" | "||"; readonly left: Node; readonly right: Node; }
/** `A if C else B` and the built-in `ifElse(C, A, B)`. */
export interface CondNode extends Base { readonly kind: "cond"; readonly test: Node; readonly then: Node; readonly else: Node; }
/** Call of a `deferEvaluation` function: arguments are passed unevaluated. */
export interface LazyCallNode extends Base { readonly kind: "lazyCall"; readonly fn: FnRef; readonly args: Node[]; }

export type Node =
  | LiteralNode | RefNode | ArrayNode | ObjectNode | LambdaNode | CallNode | ApplyNode
  | ChainNode | UnaryNode | BinaryNode | LogicalNode | CondNode | LazyCallNode;

export type Step =
  | { readonly kind: "prop"; readonly key: string; readonly guard: boolean; readonly src: SourceRef }
  | { readonly kind: "index"; readonly keys: Node[]; readonly multi: boolean; readonly guard: boolean; readonly src: SourceRef }
  | { readonly kind: "pick"; readonly keys: Node[]; readonly guard: boolean; readonly src: SourceRef }
  /** `:fn(args)`; the receiver is prepended to `args` at run time. */
  | { readonly kind: "invoke"; readonly fn: FnRef; readonly args: Node[]; readonly guard: boolean; readonly src: SourceRef }
  | { readonly kind: "invokeUser"; readonly callee: Node; readonly args: Node[]; readonly guard: boolean; readonly src: SourceRef };

export type Decl =
  | { readonly kind: "var"; readonly name: string; readonly value: Node; readonly src: SourceRef }
  | { readonly kind: "fn"; readonly name: string; readonly params: Param[]; readonly body: Node; readonly src: SourceRef };

export type Field =
  | { readonly kind: "static"; readonly key: string; readonly value: Node; readonly optional: boolean; readonly src: SourceRef }
  | { readonly kind: "dynamic"; readonly source: Node; readonly valueName?: string; readonly keyName?: string; readonly value: Node; readonly src: SourceRef };
