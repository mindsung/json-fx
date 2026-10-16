export { JsonFx } from "./api/json-fx";
export type { FxCompiledTemplate, JsonFxOptions } from "./api/json-fx";
export type {
  CompileOptions, FxFunctionDef, FxInput, FxLazyArg, FxOperatorDef, FxParamDef, SourceRef
} from "./api/types";
export { FxCompileError, FxError, FxRuntimeError, FxSyntaxError } from "./errors";
export type { BareWord, FxWarning } from "./semantics/resolve";
export { builtinFunctions } from "./stdlib";
export type { CheckOptions, CheckReport, Finding, FindingRule } from "./check/check";

// Names the 0.x typings exported, kept as aliases so TypeScript code written against 0.x still compiles.
// (0.x's `FxDefinition`/`FxIntrinsicDefinition` exposed parser internals and have no equivalent.)
import type { FxFunctionDef, FxOperatorDef, FxParamDef } from "./api/types";
/** @deprecated Use `FxFunctionDef`. */
export type FxExpressionDefinition = FxFunctionDef;
/** @deprecated Use `FxFunctionDef`. */
export type FxEvaluatorDefinition = FxFunctionDef;
/** @deprecated Use `FxOperatorDef`. */
export type FxOperatorDefinition = FxOperatorDef;
/** @deprecated Use `FxParamDef`. */
export type FxParamDefinition = FxParamDef;
export type AnyFn = (...args: any[]) => any;
