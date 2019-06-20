import {JsonFx} from "./expressions";
import {FxLoader} from "./compiler/runtime/fx-loader";
import {FxCompiler} from "./compiler/runtime/fx-compiler";
import {describe} from "mocha";
import {FxContext} from "./compiler/lex/model/fx-context";
import {FxTemplateParser} from "./compiler/lex/fx-template-parser";
import {cableDataTemplate} from "./sample/cable-data-template";
import {$CABLE_DATA} from "./sample/sources/cable-data";
import {FxTemplateCompiler} from "./compiler/runtime/fx-template-compiler";

const context = new FxContext(new FxLoader(JsonFx.expressions));
const parser = new FxTemplateParser(context);
const compiler = new FxCompiler(context);

describe("Sandbox", () => {
  it("Executes w/o throwing exceptions", function () {
    const fx = new FxTemplateCompiler(JsonFx.expressions);
    const compiled = fx.compile(cableDataTemplate);
    const output = compiled.evaluate({ name: "$", value: $CABLE_DATA });
    console.log(JSON.stringify(output, null, 2));
  });
});
