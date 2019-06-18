import { FxExpressionDefinition, FxIntrinsic } from "../defs";

export const exprIntrinsic: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: FxIntrinsic.Lambda,
    operator: { symbol: "=>", precedence: 0 }
  },
  {
    name: FxIntrinsic.Invoke,
    operator: { symbol: ":", precedence: 4 }
  },
  {
    name: FxIntrinsic.Tuple,
    operator: { symbol: ",", precedence: -1 }
  },
  {
    name: "prop",
    expression: (obj: any, propName: string) => {
      if (obj !== null) {
        return obj[propName];
      } else {
        throw new Error(`Cannot evaluate property "${propName}" of null`);
      }
    },
    operator: { symbol: ".", precedence: 4 }
  },
  {
    name: "nullprop",
    expression: (obj: any, propName: string) => {
      return obj ? obj[propName] : null;
    },
    operator: { symbol: "?.", precedence: 4 }
  },
];
