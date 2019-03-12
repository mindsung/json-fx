import { FxModule } from "./fx-module";
import { ExpressionScope } from "../core/expression";

export abstract class FxParser<TIn, TOut = void> {
  constructor(public module: FxModule = new FxModule()) {
  }

  abstract evaluate(item: TIn): TOut;
}

export abstract class FxCompiler<TIn> extends FxParser<TIn, ExpressionScope<any>> {
}
