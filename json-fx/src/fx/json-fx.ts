import { Loader } from "../lexer/loader";
import { TemplateParser } from "../lexer/template-parser";
import { FxExpression } from "../runtime/fx-expression";
import { FxConstant } from "../runtime/fx-constant";
import { FxScope } from "../runtime/scope/fx-scope";
import { FxConstantVariable, FxScopeVariable } from "../runtime/scope/fx-scope-variable";
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
    return new FxCompiledTemplateImpl(root, subScope);
  }

  public define(def: FxExpressionDefinition): void {
    this.loader.defineExpression(def);
  }
}

export interface FxCompiledTemplate {
  evaluate(...inputs: FxInput[]): any;
  clearInputs(): void;
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

  private inputs: { [name: string]: FxConstantVariable } = {};

  evaluate(...inputs: FxInput[]): any {
    for (const input of inputs) {
      const current = this.inputs[input.name];
      if (current) {
        current.replaceValue(input.value);
      }
      else {
        if (input.name == null || !input.name.startsWith("$")) {
          throw new Error("Input variable names must begin with '$'.");
        }
        const c = new FxConstantVariable(input.name, input.value);
        this.scope.setVariable(c);
        this.inputs[input.name] = c;
      }
    }
    return this.expr.evaluate();
  }

  clearInputs() {
    this.inputs = {};
    this.scope.clearVariables();
  }
}

export interface FxInput {
  name: string;
  value: any;
}
