import { FxExpressionDefinition } from "../../model/fx-definition";

export const ExprConversion: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "toString",
    evaluate: (val: any) => val.toString()
  }
];
