import { FxTemplateCompiler } from "./parser/fx-template-compiler";
import { createExpressionConstant, fxCoreExpressions, stockExpressions } from "./expressions";
import { FxModule } from "./core/fx-module";

export * from "./core/expression";

export * from "./expressions";

export * from "./parser/fx-template-compiler";

export function fxCompile(template: any) {
  const expr = new FxTemplateCompiler(new FxModule(stockExpressions)).evaluate(template);
  const exprVars = expr.vars;
  return (...inputs: any[]): any => {
    const vars = inputs.map((input, i) => ({ name: "$" + (i + 1), expr: createExpressionConstant(input) }));
    if (vars.length > 0) {
      vars.unshift({ name: "$", expr: vars[0].expr });
    }
    expr.vars = exprVars.concat(vars);
    return expr.value;
  };
}
