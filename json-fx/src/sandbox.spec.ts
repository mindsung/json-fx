import {Fx} from "./expressions";
import {describe} from "mocha";
import {cableDataTemplate} from "./sample/cable-data-template";
import {$CABLE_DATA_1, $CABLE_DATA_2} from "./sample/sources/cable-data";
import {JsonFx} from "./compiler/runtime/json-fx";

const fs = require("fs");

describe("Sandbox", () => {
  it("Executes w/o throwing exceptions", function () {
    const fx = new JsonFx(Fx.expressions);
    const script = fx.compile(cableDataTemplate);

    const output1 = script.evaluate({name: "$", value: $CABLE_DATA_1});
    console.log(output1);

    const output2 = script.evaluate({name: "$", value: $CABLE_DATA_2});
    console.log(output2);

    // fs.writeFile("./cable-1.json", JSON.stringify(output1, null, 2), err => console.log(err));
    // fs.writeFile("./cable-2.json", JSON.stringify(output2, null, 2), err => console.log(err));
  });
});
