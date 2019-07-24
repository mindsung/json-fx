import { FxTokenNode } from "../lexer/node/fx-token-node";

export interface FxParser<TIn = FxTokenNode, TOut = void> {
  parse(item: TIn): TOut;
}
