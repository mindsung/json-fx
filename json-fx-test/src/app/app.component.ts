import { Component, OnInit } from "@angular/core";
import { $BOOKS } from "../sample-data/books-2";
import { $const, $expr, $lambda, $eval, allSampleData, bar } from "../sample-data/all-sample-data";
import { FxScriptCompiler, FxObjectCompiler, ExpressionEvaluator } from "@mindsung/expression";
import { $POKEMON } from "../spec/data/pokemon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private fxData: any;
  private fxScript = "$.title";

  private fxBooks: object = $BOOKS;

  private scriptCompiler = new FxScriptCompiler();
  private objectCompiler = new FxObjectCompiler();

  ngOnInit() {
    this.onEval(null);

    window["$fxScript"] = (data: any, expr: string) => {
      console.log(new ExpressionEvaluator(this.scriptCompiler.evaluate(expr)).evaluate([{
        name: "$",
        expr: $const(data)
      }]));
    };

    window["$fxObject"] = (data: any, obj: object) => {
      console.log(new ExpressionEvaluator(this.objectCompiler.evaluate(obj)).evaluate([{
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
    const result = new ExpressionEvaluator(this.scriptCompiler.evaluate(this.fxScript)).evaluate([{
      name: "$",
      expr: $const($BOOKS)
    }]);
    this.fxData = result;
  }
}
