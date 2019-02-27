import {Component, OnInit} from "@angular/core";
import {$BOOKS} from "../sample-data/books-2";
import {allSampleData, foo} from "../sample-data/all-sample-data";
import {
  $f,
  $fx,
  $withVars,
  FxCoreModule,
  FxScriptCompiler,
  FxObjectCompiler
} from "@mindsung/expression";
import {$POKEMON} from "../spec/data/pokemon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const scriptCompiler = new FxScriptCompiler(new FxCoreModule());
    const objectCompiler = new FxObjectCompiler(new FxCoreModule());

    window["$fxScript"] = (data: any, expr: string) => {
      console.log($fx("_transform", data, scriptCompiler.evaluate(expr)).evaluate());
    };

    window["$fxObject"] = (data: any, obj: object) => {
      console.log($fx("_transform", data, objectCompiler.evaluate(obj)).evaluate());
    };

    window["$BOOKS"] = $BOOKS;
    window["$POKEMON"] = $POKEMON;

    window["$f"] = $f;
    window["$fx"] = $fx;
    window["$withVars"] = $withVars;
    window["$foo"] = foo;
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
  }
}
