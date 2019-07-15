import {describe, it} from "mocha";
import {$CABLE_DATA_1} from "./sample/sources/cable-data";
import {JsonFx} from "./compiler/runtime/json-fx";
import {coreExpressions} from "./expressions/core";
import {mathExpressions} from "./expressions/math";
import { cableDataTemplate } from "./sample/cable-data-template";
import * as fs from "fs";

// const fs = require("fs");

describe("Sandbox", () => {
  it("Executes w/o throwing exceptions", function () {
    const fx = new JsonFx(coreExpressions, mathExpressions);

    const script = fx.compile(cableDataTemplate);
    // const script = fx.compiler({
    //   "@doSomething($a, $b)": {
    //     "a": "`var $a = ` + $a",
    //     "b": "`var $b = ` + $b",
    //     "a_and_b": "`var $a = ` + $a + ` and var $b = ` + $b"
    //   },
    //   "$c": "$.a + $.b",
    //   "$d": "@doSomething($.a, $.b)",
    //   "result": {
    //     "c": "$c",
    //     "d": "$d",
    //     "abc": "$.a + $.b + $c"
    //   }
    // });

    const output1 = script.evaluate({name: "$", value: $CABLE_DATA_1});
    // const output1 = script.evaluate({ name: "$", value: { a: 3, b: 5 } });
    console.log(output1);

    // const output2 = script.evaluate({name: "$", value: $CABLE_DATA_2});
    // console.log(output2);

    fs.writeFile("./cable-1.json", JSON.stringify(output1, null, 2), err => console.log(err));
    // fs.writeFile("./cable-2.json", JSON.stringify(output2, null, 2), err => console.log(err));
  });
});
