import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";
import { FxContext } from "./model/fx-context";
import { FxCompiler } from "../runtime/fx-compiler";

export class OperatorContextParser implements FxParser<FxTokenNode, void> {

  private context: FxContext;
  private token: FxTokenNode;

  // TODO: Temporary method of defining a compiler for all tokens
  private compilerBackup: FxCompiler;

  constructor(context: FxContext) {
    this.context = context;
    this.compilerBackup = new FxCompiler(context);
  }

  public parse(item: FxTokenNode): void {
    this.token = item;

    if (this.token.parent && this.token.parent.tag == "object" && this.token.tag == "operator" && this.token.symbol == ":") {
      item.symbol = ":a";
    }

    this.loadDefinitions();
  }

  private loadDefinitions(): void {
    const intrinsic = this.context.loader.getIntrinsic(this.token.tag);

    if (intrinsic) {
      if (intrinsic.optimize) {
        this.token.optimizer = intrinsic.optimize;
      }
      if (intrinsic.compile) {
        this.token.compiler = intrinsic.compile;
      }
    }

    const operator = this.context.loader.getOperator(this.token.symbol);

    if (operator) {
      this.token.operator = operator;
      this.token.tag = "operator";
      const expression = this.context.loader.getExpression(operator.symbol);

      if (expression) {
        this.token.symbol = expression.name;
      }
    }
  }
}
