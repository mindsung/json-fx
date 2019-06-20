import {JsonFx} from "./expressions";
import {FxLoader} from "./compiler/runtime/fx-loader";
import {FxCompiler} from "./compiler/runtime/fx-compiler";
import {describe} from "mocha";
import {FxContext} from "./compiler/lexer/model/fx-context";
import {FxTemplateParser} from "./compiler/lexer/fx-template-parser";
import {cableDataTemplate} from "./sample/cable-data-template";
import {$CABLE_DATA_1, $CABLE_DATA_2} from "./sample/sources/cable-data";
import {FxTemplateCompiler} from "./compiler/runtime/fx-template-compiler";

const context = new FxContext(new FxLoader(JsonFx.expressions));
const parser = new FxTemplateParser(context);
const compiler = new FxCompiler(context);

describe("Sandbox", () => {
  it("Executes w/o throwing exceptions", function () {
    const fx = new FxTemplateCompiler(JsonFx.expressions);
    const compiled = fx.compile(cableDataTemplate);
    const output1 = compiled.evaluate({ name: "$", value: $CABLE_DATA_1 });
    console.log(output1);
    const output2 = compiled.evaluate({ name: "$", value: $CABLE_DATA_2 });
    console.log(output2);
  });
});
