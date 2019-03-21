import { FxTemplateCompiler } from "./parser/fx-template-compiler";
import { createExpressionConstant } from "./expressions";

export * from "./core/expression";
export * from "./core/expression-set";

export * from "./expressions";

export * from "./parser/fx-template-compiler";

export function fxCompile(template: any) {
  const expr = new FxTemplateCompiler().evaluate(template);
  const exprVars = expr.vars;
  return (...inputs: any[]): any => {
    const vars = inputs.map((input, i) => ({ name: "$" + (i + 1), expr: createExpressionConstant(input) }));
    if (vars.length > 0) { vars.unshift({ name: "$", expr: vars[0].expr }); }
    expr.vars = exprVars.concat(vars);
    return expr.value;
  }
}
