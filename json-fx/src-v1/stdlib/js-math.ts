import type { FxFunctionDef } from "../api/types";

/** Every `Math` function and constant as `math~name` (constants are zero-argument functions). */
export const jsMath: readonly FxFunctionDef[] = Object.getOwnPropertyNames(Math).flatMap((key): FxFunctionDef[] => {
  const prop = (Math as unknown as Record<string, unknown>)[key];
  const pure = key !== "random";
  if (typeof prop === "function") {
    return [{ name: "math~" + key, pure, evaluate: (...params: any[]) => (prop as (...a: any[]) => any)(...params) }];
  }
  if (typeof prop === "number") {
    return [{ name: "math~" + key, pure, evaluate: () => prop }];
  }
  return [];
});
