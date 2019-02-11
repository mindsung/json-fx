import { Component, OnInit } from "@angular/core";
import { allSampleData, foo } from "../sample-data/all-sample-data";
import { $f, $fx, $withVars } from "@mindsung/expression";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.scss" ]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // $f(name: string, exprParams...)
    window["$f"] = $f;
    // $fx(name: string, input: Expression<any>, exprParams...)
    window["$fx"] = $fx;
    window["$withVars"] = $withVars;
    window["$foo"] = foo;
    // window["$parser"] = new ExpressionParser();
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
