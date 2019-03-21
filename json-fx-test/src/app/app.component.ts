import { Component, OnInit } from "@angular/core";
import { $BOOKS } from "../sample-data/books-2";
import { $const, $expr, $lambda, $eval, allSampleData, bar } from "../sample-data/all-sample-data";
import { FxTemplateCompiler, ExpressionEvaluator } from "@mindsung/json-fx";
import { $POKEMON } from "../spec/data/pokemon";
import { $DSP } from "../sample-data/dsp";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public fxData: any;
  public fxScript = "$";

  public fxSource: object = $DSP;

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
    window["$DSP"] = $DSP;

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

  private lastScript: string;
  private lastEvaluator: ExpressionEvaluator;

  public onEval(event: MouseEvent) {
    if (this.lastEvaluator == null || this.fxScript !== this.lastScript) {
      this.lastEvaluator = new ExpressionEvaluator(
        this.templateCompiler.evaluate(this.fxScript.startsWith("{") || this.fxScript.startsWith("[") ? JSON.parse(this.fxScript) : this.fxScript)
      );
    }
    const result = this.lastEvaluator.evaluate([{
      name: "$",
      expr: $const(this.fxSource)
    }]);
    console.log(result);
    this.fxData = result;
  }
}
