import { ExpressionScope } from "../../index";
import { FxModule } from "../core/fx-module";

export abstract class FxParser<TIn, TOut = void> {
  protected constructor(protected module: FxModule) {
  }

  abstract evaluate(item: TIn): TOut;
}

export abstract class FxCompiler<TIn> extends FxParser<TIn, ExpressionScope> {
}
