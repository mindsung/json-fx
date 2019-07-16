import { FxFunction } from "../compiler/runtime/model/fx-function";
import { FxExpressionDefinition } from "../compiler/lexer/model/fx-definition";
import { FxIntrinsic } from "../defs";

export const exprIntrinsic: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: FxIntrinsic.Lambda,
    operator: {symbol: "=>", precedence: 0}
  },
  {
    name: FxIntrinsic.Invoke,
    operator: {symbol: ":", precedence: 4}
  },
  {
    name: FxIntrinsic.NullInvoke,
    operator: {symbol: "?:", precedence: 4},
    deferEvaluation: true,

    evaluate: (result: FxFunction) => {
      const evalFirstArg = result.args[0].evaluate();
      return evalFirstArg == null ? null : result.evaluate();
    }
  },
  {
    name: FxIntrinsic.Prop,
    operator: {symbol: ".", precedence: 4}
  },
  {
    name: FxIntrinsic.NullProp,
    operator: {symbol: "?.", precedence: 4}
  }
];
