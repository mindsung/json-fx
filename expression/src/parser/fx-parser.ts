import {FxModule} from "../modules/fx-module";

export abstract class FxParser<TIn, TOut = void> {
  constructor(public module: FxModule) {
  }

  abstract evaluate(item: TIn): TOut;
}
