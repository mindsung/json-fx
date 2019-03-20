import { FxCompiler } from "./fx-parser";
import { FxModule } from "./fx-module";
import { FxScriptCompiler } from "./fx-script-compiler";
import { ExpressionScope, ScopeVariable } from "../core/expression";
import { createExpressionConstant, ObjectExpressionProperty } from "../expressions";
import { isString, isArray, isObjectLike } from "lodash";

export class FxTemplateCompiler extends FxCompiler<any> {

  private scriptCompiler: FxScriptCompiler;

  constructor(module: FxModule = new FxModule()) {
    super(module);
    this.scriptCompiler = new FxScriptCompiler(module);
  }

  evaluate(template: any): ExpressionScope<any> {
    if (isString(template)) {
      return this.scriptCompiler.evaluate(template);
    }
    else if (isArray(template)) {
      const exprArray = template.map(item => this.evaluate(item));
      return this.module.exprSet.createExpressionScope("_array")
        .withParams([createExpressionConstant(exprArray)])
        .withScopeExprs(exprArray);
    }
    else if (isObjectLike(template)) {
      const objProps: ObjectExpressionProperty[] = [];
      const vars: ScopeVariable[] = [];
      let expr: ExpressionScope = null;
      let exprValue: any = null;
      Object.keys(template).forEach(key => {
        if (key.startsWith("//")) { return; }

        const keyAsExpr = key.startsWith("*");
        if (keyAsExpr) {
          key = key.substring(1);
        }
        const isOptional = key.endsWith("?");
        if (isOptional) {
          key = key.substring(0, key.length - 1);
        }

        const keyExpr = this.scriptCompiler.evaluate(key);
        const value = template[key];
        if (keyExpr.expr.key === "_var") {
          vars.push({ name: key, expr: this.evaluate(value) });
        }
        else if (keyAsExpr || keyExpr.expr.key === "_const") {
          if (expr != null) {
            throw new Error("Expression definition cannot include both object keys an expression.");
          }
          objProps.push({ keyExpr, valueExpr: this.evaluate(value), isOptional });
        }
        else {
          if (objProps.length > 0) {
            throw new Error("Expression definition cannot include both object keys an expression.");
          }
          else if (expr != null) {
            throw new Error("Expression definition can include only a single expression.");
          }
          expr = keyExpr;
          exprValue = value;
        }
      });

      if (objProps.length > 0) {
        return this.module.exprSet.createExpressionScope("_object")
          .withParams([createExpressionConstant(objProps)])
          .withScopeExprs(objProps.map(p => p.keyExpr).concat(objProps.map(p => p.valueExpr)))
          .withVars(vars);
      }
      else if (expr != null) {
        return expr.withParams(isArray(exprValue) ? exprValue.map(item => this.evaluate(item)) : [this.evaluate(exprValue)])
          .withVars(vars);
      }
      else {
        throw new Error("Invalid expression definition. Object must contain either object keys or an expression.");
      }
    }
    else {
      return createExpressionConstant(template);
    }
  }
}
