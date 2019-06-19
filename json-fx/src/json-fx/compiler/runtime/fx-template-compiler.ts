import { FxExpressionDefinition } from "../../defs";
import { FxLoader } from "./fx-loader";
import { FxContext } from "../lex/model/fx-context";
import { FxTemplateParser } from "../lex/fx-template-parser";
import { FxCompiler } from "./fx-compiler";
import { FxExpression } from "./model/fx-expression";
import { FxConstant } from "./model/fx-constant";

export class FxTemplateCompiler {
  constructor(...expressions: [ReadonlyArray<FxExpressionDefinition>]) {
    this.context = new FxContext(new FxLoader(...expressions));
    this.parser = new FxTemplateParser(this.context);
    this.compiler = new FxCompiler(this.context);
  }

  private readonly context: FxContext;
  private readonly parser: FxTemplateParser;
  private readonly compiler: FxCompiler;

  compile(template: any): FxCompiledTemplate {
    const expr = this.compiler.evaluate(this.parser.evaluate(template));
    expr.bindScope();
    return new FxCompiledTemplateImpl(expr);
  }
}

export interface FxCompiledTemplate {
  evaluate(input: any): any;
}

class FxCompiledTemplateImpl implements FxCompiledTemplate {
  constructor(private readonly expr: FxExpression) {}

  evaluate(...inputs: FxInput[]): any {
    // this.expr.scope.clearAll();
    inputs.forEach(input => {
      if (input.name == null || !input.name.startsWith("$")) {
        throw new Error("Input variable names must begin with '$'.");
      }
      this.expr.scope.setVariable(input.name, new FxConstant(input.value));
    });
    return this.expr.evaluate();
  }
}

export interface FxInput {
  name: string;
  value: any;
}
