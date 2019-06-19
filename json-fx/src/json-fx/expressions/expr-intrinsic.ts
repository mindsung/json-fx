import { FxExpressionDefinition, FxIntrinsic } from "../defs";
import { FxExpression } from "../compiler/runtime/model/fx-expression";
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
      return (evalFirstArg == null || evalFirstArg == undefined)
        ? null
        : result.evaluate();
    }
  },
  {
    name: FxIntrinsic.Tuple,
    operator: { symbol: ",", precedence: -1 }
  },
  {
    name: FxIntrinsic.Prop,
    operator: { symbol: ".", precedence: 4 }
  },
  {
    name: FxIntrinsic.NullProp,
    operator: { symbol: "?.", precedence: 4 }
  },
];
