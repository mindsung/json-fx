import {Component, OnInit} from "@angular/core";
import {$BOOKS} from "../sample-data/books-2";
import {allSampleData, foo} from "../sample-data/all-sample-data";
import {
  $f,
  $fx,
  $withVars,
  FxExpressionParser,
  FxGrouper,
  FxNodeParser,
  FxOperatorParser,
  FxTokenizer,
  FxCoreModule,
  FxCompiler,
  TransformExpression
} from "@mindsung/expression";
import {$POKEMON} from "../spec/data/pokemon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const tokenizer = new FxTokenizer();
    const grouper = new FxGrouper();

    const module = new FxCoreModule();

    const parser = new FxNodeParser(module,
      new FxExpressionParser(module),
      new FxOperatorParser(module));

    const compiler = new FxCompiler(module);

    window["$eval"] = (data: any, expr: string) => {
      const tokens = tokenizer.evaluate(expr);
      const root = grouper.evaluate(tokens);

      parser.evaluate(root);
      const fx = compiler.evaluate(root);

      console.log(root);
      console.log($fx("_transform", data, fx).evaluate());
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
