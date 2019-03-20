import { Component, OnInit } from "@angular/core";
import { $BOOKS } from "../sample-data/books-2";
import { $const, $expr, $lambda, $eval, allSampleData, bar } from "../sample-data/all-sample-data";
import { FxTemplateCompiler, ExpressionEvaluator } from "@mindsung/expression";
import { $POKEMON } from "../spec/data/pokemon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private fxData: any;
  private fxScript = "$";

  private fxBooks: object = $BOOKS;

  private templateCompiler = new FxTemplateCompiler();

  ngOnInit() {
    this.onEval(null);

    window["$fx"] = (data: any, expr: any) => {
      console.log(new ExpressionEvaluator(this.templateCompiler.evaluate(expr)).evaluate([{
        name: "$",
        expr: $const(data)
      }]));
    };

    window["$BOOKS"] = $BOOKS;
    window["$POKEMON"] = $POKEMON;

    window["$bar"] = bar;
    window["$sample"] = allSampleData;
    window["$toJson"] = JSON.stringify;
    window["$fromJson"] = (json: string) => {
      const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.000Z$/;
      const reviver = (key: string, value: string) => {
        if (typeof value === "string" && dateFormat.test(value)) {
          return new Date(value);
        }
        return value;
      };
      return JSON.parse(json, reviver);
    };

    window["$expr"] = $expr;
    window["$const"] = $const;
    window["$lambda"] = $lambda;
    window["$eval"] = $eval;
  }

  public onEval(event: MouseEvent) {
    const result = new ExpressionEvaluator(
      this.templateCompiler.evaluate(this.fxScript.startsWith("{") ? JSON.parse(this.fxScript) : this.fxScript)
    ).evaluate([{
      name: "$",
      expr: $const($BOOKS)
    }]);
    this.fxData = result;
  }
}
