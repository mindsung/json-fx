import { FxExpressionDefinition } from "../../defs";
import { FxLoader } from "./fx-loader";
import { FxContext } from "../lexer/model/fx-context";
import { TemplateParser } from "../lexer/template-parser";
import { FxCompiler } from "./fx-compiler";
import { FxExpression } from "./model/fx-expression";
import { FxConstant } from "./model/fx-constant";
import { FxScope } from "./fx-scope";

export class JsonFx {

  private readonly context: FxContext;
  private readonly parser: TemplateParser;
  private readonly compiler: FxCompiler;

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.context = new FxContext(new FxLoader(...expressions));
    this.parser = new TemplateParser(this.context);
    this.compiler = new FxCompiler(this.context);
  }

  compile(template: any): FxCompiledTemplate {
    const root = this.parser.parse(template);
    console.log(root.toString());

    const expr = this.compiler.compile(root);
    return new FxCompiledTemplateImpl(expr);
  }
}

export interface FxCompiledTemplate {
  evaluate(...inputs: FxInput[]): any;
}

class FxCompiledTemplateImpl implements FxCompiledTemplate {

  private readonly global: FxScope;
  private readonly expr: FxExpression;

  constructor(expr: FxExpression) {
    this.expr = expr;
    this.global = new FxScope();

    this.expr.bindScope(this.global);
  }

  evaluate(...inputs: FxInput[]): any {
    this.global.deleteAll();

    inputs.forEach(input => {
      if (input.name == null || !input.name.startsWith("$")) {
        throw new Error("Input variable names must begin with '$'.");
      }
      this.global.setVariable(input.name, new FxConstant(input.value));
    });
    return this.expr.evaluate();
  }
}

export interface FxInput {
  name: string;
  value: any;
}
