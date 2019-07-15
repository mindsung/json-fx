import { FxTokenNode } from "../lexer/model/fx-token-node";
import { FxExpression } from "./model/fx-expression";

export class FxCompiler {

  public compile(root: FxTokenNode): FxExpression {
    const result = root.compile();
    result.sourceRef = { symbol: root.symbol, index: root.index };

    return result;
  }
}
