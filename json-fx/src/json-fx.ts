import { Expression } from "./v0/core/expression";
import { FxTemplateCompiler } from "./v0/parser/fx-template-compiler";
import { FxModule } from "./v0/core/fx-module";

export class JsonFx {
  private compiler: FxTemplateCompiler;

  constructor(public module: FxModule) {
    this.compiler = new FxTemplateCompiler(module);
  }

  evaluate(template: any) {
    return this.compiler.evaluate(template);
  }
}
