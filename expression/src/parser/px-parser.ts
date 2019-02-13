export interface PxParser<TIn, TOut = void> {
    evaluate(item: TIn): TOut;
}
