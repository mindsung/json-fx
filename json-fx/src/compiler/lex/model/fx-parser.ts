import {FxContext} from "./fx-context";

export abstract class FxParser<TIn, TOut = void> {
  protected context: FxContext;

  constructor(context?: FxContext) {
    this.context = context || null;
  }

  public abstract parse(item: TIn): TOut;
}

