import { Component, OnInit } from "@angular/core";
import { allSampleData, foo } from "../sample-data/all-sample-data";
import { createExpression, createExpressionWithInput } from "@mindsung/expression";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.scss" ]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // $f(name: string, exprParams...)
    window["$f"] = (...params: any[]) => createExpression(params[0], params.length > 1 ? params.slice(1) : []);
    // $fx(name: string, input: Expression<any>, exprParams...)
    window["$fx"] = (...params: any[]) => createExpressionWithInput(params[0], params.length > 1 ? params[1] : null, params.length > 2 ? params.slice(2) : []);
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
