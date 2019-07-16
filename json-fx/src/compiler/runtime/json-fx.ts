import { FxLoader } from "./fx-loader";
import { FxContext } from "../lexer/model/fx-context";
import { TemplateParser } from "../lexer/template-parser";
import { FxExpression } from "./model/fx-expression";
import { FxConstant } from "./model/fx-constant";
import { FxScope } from "./fx-scope";
import { FxScopeVariable } from "./model/fx-scope-variable";
import { FxExpressionDefinition } from "../lexer/model/fx-definition";
import { coreExpressions } from "../../expressions/core";
import { mathExpressions } from "../../expressions/math";

export class JsonFx {

  private readonly context: FxContext;
  private readonly parser: TemplateParser;

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.context = new FxContext(new FxLoader(...expressions));
    this.parser = new TemplateParser(this.context);
  }

  public compile(template: any): FxCompiledTemplate {
    const root = this.parser.parse(template);
    console.log(root.toString());
    return new FxCompiledTemplateImpl(root.compile());
  }

  public define(def: FxExpressionDefinition): void {
    this.context.loader.defineExpression(def);
  }

  public static std(): JsonFx {
    return new JsonFx(coreExpressions, mathExpressions);
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
    this.expr.bindSourceRefPath();
  }

  evaluate(...inputs: FxInput[]): any {
    this.global.clearVariables();

    inputs.forEach(input => {
      if (input.name == null || !input.name.startsWith("$")) {
        throw new Error("Input variable names must begin with '$'.");
      }
      this.global.setVariable(new FxScopeVariable(input.name, new FxConstant(input.value)));
    });
    return this.expr.evaluate();
  }
}

export interface FxInput {
  name: string;
  value: any;
}
