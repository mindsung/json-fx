import {Component, OnInit} from "@angular/core";
import {$BOOKS} from "../sample-data/books-2";
import {allSampleData, bar, foo} from "../sample-data/all-sample-data";
import {
  $f,
  $fx,
  $withVars,
  FxCoreModule,
  FxScriptCompiler,
  FxObjectCompiler, $expr, $const, $eval, $lambda
} from "@mindsung/expression";
import {$POKEMON} from "../spec/data/pokemon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private fxData: any;
  private fxScript = "$.title";

  private fxBooks: object = $BOOKS;

  private scriptCompiler = new FxScriptCompiler(new FxCoreModule());
  private objectCompiler = new FxObjectCompiler(new FxCoreModule());

  ngOnInit() {
    this.onEval(null);

    window["$fxScript"] = (data: any, expr: string) => {
      console.log($fx("_transform", data, this.scriptCompiler.evaluate(expr)).evaluate());
    };

    window["$fxObject"] = (data: any, obj: object) => {
      console.log($fx("_transform", data, this.objectCompiler.evaluate(obj)).evaluate());
    };

    window["$BOOKS"] = $BOOKS;
    window["$POKEMON"] = $POKEMON;

    window["$f"] = $f;
    window["$fx"] = $fx;
    window["$withVars"] = $withVars;
    window["$foo"] = foo;
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
    window["$eval"] = $eval;
    window["$lambda"] = $lambda;
  }

  public onEval(event: MouseEvent) {
    const result = $fx("_transform", $BOOKS, this.scriptCompiler.evaluate(this.fxScript)).evaluate();
    this.fxData = result;
  }
}
