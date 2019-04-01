/*!
JSON-Fx

MIT License

Copyright (c) 2019 Aaron Eads

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
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
