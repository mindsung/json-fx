import { FunctionRegistry } from "../api/registry";
import type { FxFunctionDef } from "../api/types";
import { arithmetic } from "./arithmetic";
import { collection } from "./collection";
import { comparative } from "./comparative";
import { conditional } from "./conditional";
import { error } from "./error";
import { jsMath } from "./js-math";
import { logical } from "./logical";
import { misc } from "./misc";
import { string } from "./string";
import { time } from "./time";

export const builtinFunctions: readonly FxFunctionDef[] = [
  ...arithmetic, ...collection, ...comparative, ...conditional, ...logical, ...string, ...time, ...misc, ...error, ...jsMath
];

/** A host-supplied definition without the internal code generator hook (`emit`), which only built-ins may set. */
export function asExtension(def: FxFunctionDef): FxFunctionDef {
  if (def.emit === undefined) { return def; }
  const { emit: _emit, ...rest } = def;
  return rest;
}

/** A fresh registry holding every built-in. */
export function createRegistry(...extensions: ReadonlyArray<readonly FxFunctionDef[]>): FunctionRegistry {
  const registry = new FunctionRegistry(builtinFunctions);
  for (const defs of extensions) { for (const def of defs) { registry.define(asExtension(def)); } }
  return registry;
}
