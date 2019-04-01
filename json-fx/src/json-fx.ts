import { Expression } from "./core/expression";
import { FxTemplateCompiler } from "./parser/fx-template-compiler";
import { FxModule } from "./core/fx-module";

export class JsonFx {
  private compiler: FxTemplateCompiler;

  constructor(public module: FxModule) {
    this.compiler = new FxTemplateCompiler(module);
  }

  evaluate(template: any) {
    return this.compiler.evaluate(template);
  }
}
