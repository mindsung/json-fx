export interface FxParser<TIn, TOut = void> {
  parse(token: TIn): TOut;
}
