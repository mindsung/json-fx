export interface FxParser<TIn, TOut = void> {
  parse(item: TIn): TOut;
}
