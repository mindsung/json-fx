import {Component, OnInit} from "@angular/core";
import {allSampleData, foo} from "../sample-data/all-sample-data";
import {
  $f,
  $fx,
  $withVars,
  PxExpressionParser,
  PxGrouper,
  PxNodeParser,
  PxOperatorParser,
  PxTokenizer
} from "@mindsung/expression";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const tokens = new PxTokenizer().evaluate("$.books:filter($$.type == `paperback`)");
    const root = new PxGrouper().evaluate(tokens);

    // PxNodeParser accepts a list of sub-parsers of type PxParser<PxNode, void>
    // - PxNodeParser is responsible for traversing the expression tree recursively; sub-parsers do not implement recursion
    // - Sub-parsers execute in a particular order, the order in which they are defined within the constructor
    //   - The order is NOT arbitrary

    const parser = new PxNodeParser(
      new PxExpressionParser(),
      new PxOperatorParser());

    parser.evaluate(root);
    console.log(root);

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
