import { Loader } from "../lexer/loader";
import { TemplateParser } from "../lexer/template-parser";
import { FxExpression } from "../runtime/fx-expression";
import { FxConstant } from "../runtime/fx-constant";
import { FxScope } from "../runtime/scope/fx-scope";
import { FxScopeVariable } from "../runtime/scope/fx-scope-variable";
import { FxExpressionDefinition } from "../model/fx-definition";
import { FxTokenNode } from "../lexer/node/fx-token-node";
import { Tokenizer } from "../lexer/tokenizer";

export class JsonFx {

  private readonly loader: Loader;
  private readonly parser: TemplateParser;
  public readonly scope: FxScope;

  constructor(...expressions: ReadonlyArray<FxExpressionDefinition>[]) {
    this.loader = new Loader(...expressions);
    this.parser = new TemplateParser(this.loader);
    this.scope = new FxScope();
  }

  public compile(template: any): FxCompiledTemplate {
    const subScope = new FxScope();
    subScope.parentScope = this.scope;

    const root = this.parser.parse(template);
    // console.log(root.toString(true));

    return new FxCompiledTemplateImpl(root, subScope);
  }

  public define(def: FxExpressionDefinition): void {
    this.loader.defineExpression(def);
  }
}

export interface FxCompiledTemplate {
  evaluate(...inputs: FxInput[]): any;

  toString(): string;
}

class FxCompiledTemplateImpl implements FxCompiledTemplate {

  private readonly scope: FxScope;
  public readonly root: FxTokenNode;
  public readonly expr: FxExpression;

  constructor(root: FxTokenNode, scope?: FxScope) {
    this.root = root;
    this.scope = scope || new FxScope();
    this.expr = root.compile();

    this.expr.bindScope(this.scope);
  }

  evaluate(...inputs: FxInput[]): any {
    this.scope.clearVariables();

    inputs.forEach(input => {
      if (input.name == null || !input.name.startsWith("$")) {
        throw new Error("Input variable names must begin with '$'.");
      }
      this.scope.setVariable(new FxScopeVariable(input.name, new FxConstant(input.value)));
    });
    return this.expr.evaluate();
  }
}

export interface FxInput {
  name: string;
  value: any;
}
