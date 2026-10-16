import type { FxFunctionDef, FxLazyArg } from "../api/types";
import { FxRuntimeError } from "../errors";

export const error: readonly FxFunctionDef[] = [
  {
    name: "notNull",
    pure: true,
    evaluate: (value: any) => {
      if (value == null) { throw new FxRuntimeError("Value cannot be null."); }
      return value;
    }
  },
  {
    name: "throw",
    deferEvaluation: true,
    evaluate: (arg: FxLazyArg) => {
      throw new FxRuntimeError(String(arg.evaluate()), arg.sourceRef);
    }
  },
  {
    name: "catch",
    deferEvaluation: true,
    evaluate: (value: FxLazyArg, catchValue?: FxLazyArg) => {
      try {
        return value.evaluate();
      } catch {
        return catchValue ? catchValue.evaluate() : null;
      }
    }
  }
];
