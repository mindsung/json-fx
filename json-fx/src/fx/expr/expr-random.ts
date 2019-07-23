import { FxExpressionDefinition } from "../../model/fx-definition";

function randomint(min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export const exprRandom: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "math~rand",
    evaluate: (min: number = 0, max: number = 1) => Math.random() * (max - min) + min
  },
  {
    name: "math~randint",
    evaluate: randomint
  },
  {
    name: "math~randselect",
    evaluate: (arr: any[]) => arr[randomint(0, arr.length)]
  }
];
