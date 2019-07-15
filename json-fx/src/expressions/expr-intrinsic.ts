import { FxExpressionDefinition, FxIntrinsic } from "../defs";
import { FxFunction } from "../compiler/runtime/model/fx-function";

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
    name: FxIntrinsic.NullInvoke,
    operator: { symbol: "?:", precedence: 4 },
    deferEvaluation: true,

    expression: (result: FxFunction) => {
      const evalFirstArg = result.args[0].evaluate();
      return evalFirstArg == null ? null : result.evaluate();
    }
  },
  {
    name: FxIntrinsic.Prop,
    operator: { symbol: ".", precedence: 4 }
  },
  {
    name: FxIntrinsic.NullProp,
    operator: { symbol: "?.", precedence: 4 }
  },
  {
    name: "assign",
    operator: { symbol: ":a", precedence: -1 }
  }
];
