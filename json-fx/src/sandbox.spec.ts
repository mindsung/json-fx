import {describe} from "mocha";
import {cableDataTemplate} from "./sample/cable-data-template";
import {$CABLE_DATA_1, $CABLE_DATA_2} from "./sample/sources/cable-data";
import {FxTemplateCompiler} from "./compiler/runtime/fx-template-compiler";
import { coreExpressions } from "./expressions/core";
import { mathExpressions } from "./expressions/math";

describe("Sandbox", () => {
  it("Executes w/o throwing exceptions", function () {
    const fx = new FxTemplateCompiler(mathExpressions, coreExpressions);
    const compiled = fx.compile(cableDataTemplate);
    const output1 = compiled.evaluate({ name: "$", value: $CABLE_DATA_1 });
    console.log(output1);
    const output2 = compiled.evaluate({ name: "$", value: $CABLE_DATA_2 });
    console.log(output2);
  });
});
