import type { FxFunctionDef } from "../api/types";

export const misc: readonly FxFunctionDef[] = [
  {
    name: "log",
    evaluate: (desc: string, val: any) => {
      console.log(desc, val);
      return val;
    }
  }
];
