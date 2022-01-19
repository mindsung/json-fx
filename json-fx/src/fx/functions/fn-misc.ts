import { FxExpressionDefinition } from "../../model/fx-definition";

export const FnMisc: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "log",
    evaluate: (desc: string, val: any) => {
      console.log(desc, val);
      return val;
    }
  }
];
