import { JsonFx } from "./json-fx/expressions";
import { FxLoader } from "./json-fx/compiler/runtime/fx-loader";
import { FxCompiler } from "./json-fx/compiler/runtime/fx-compiler";
import { describe } from "mocha";
import { expect } from "chai";
import { FxContext } from "./json-fx/compiler/lex/model/fx-context";
import { sample1 } from "./sample/template";
import { FxObjectParser } from "./json-fx/compiler/lex/fx-object-parser";
import { FxConstant } from "./json-fx/compiler/runtime/model/fx-constant";
import { $FIRST_NAMES } from "./sample/sources/first-names";
import { $LAST_NAMES } from "./sample/sources/last-names";

const loader = new FxLoader(JsonFx.expressions);

const parser = new FxObjectParser(new FxContext(loader));
const compiler = new FxCompiler(new FxContext(loader));

describe("Sandbox", () => {
  it("Executes w/o throwing exceptions", function () {
    // The result of the parser is a lexical graph of tokens, optimized
    const root = parser.evaluate("$names.foo?:length()");
    console.log(root.toString());

    // The compiler converts the lexical graph into the executable tree
    // Recursively bind scopes in the tree so that child expressions can access variables
    const expr = compiler.evaluate(root);
    expr.bindScope();
    console.log(expr.toString());

    // "expr" is the root node. Set a variable called "$names" at the root scope
    expr.scope.setVariable("$names", new FxConstant({ first: { names: $FIRST_NAMES }, last: $LAST_NAMES }));

    const result = expr.evaluate();
    console.log(result);
  });
});
