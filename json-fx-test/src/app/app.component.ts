import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { $BOOKS } from "../sample-data/books-2";
import { $const, $eval, $expr, $lambda, allSampleData, bar } from "../sample-data/all-sample-data";
import { ExpressionEvaluator, FxTemplateCompiler } from "@mindsung/json-fx";
import { $POKEMON } from "../spec/data/pokemon";
import { $DSP } from "../sample-data/dsp";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public fxScript = "$";
  public fxSource: object = $BOOKS;

  public fxResult = new BehaviorSubject("");

  private templateCompiler = new FxTemplateCompiler();

  ngOnInit() {
    this.onEval();

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

  public onEval() {
    if (this.lastEvaluator == null || this.fxScript !== this.lastScript) {
      this.lastEvaluator = new ExpressionEvaluator(
        this.templateCompiler.evaluate(this.fxScript.startsWith("{") || this.fxScript.startsWith("[") ? JSON.parse(this.fxScript) : this.fxScript)
      );
    }

    this.fxResult.next(this.lastEvaluator.evaluate([{
      name: "$",
      expr: $const(this.fxSource)
    }]));
  }
}
