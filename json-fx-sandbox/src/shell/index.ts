import { JsonFx } from "@mindsung/json-fx";
import { cryptoExpressions } from "@mindsung/json-fx-crypto";
import { FxScopeVariable } from "../../../json-fx/src/runtime/model/fx-scope-variable";

const io = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\nJSON-fx v1.0.0");
console.log("Developed by Aaron Eads and Robb Eads\n");
console.log("Assign to variables w/ equals (=) symbol (e.g. $a = 100)\n");

const fx = new JsonFx(cryptoExpressions);

function prompt() {
  io.question(">>> ", input => {
    try {
      let result = evaluate(input);

      if (result != null) {
        result = JSON.stringify(result);
      }

      console.log(">>> " + result);

    } catch (e) {
      console.log("ERR " + (e.message ? e.message : "Unknown error occurred"));
    }

    prompt();
  });
}

function evaluate(expr: string) {
  let result = undefined;
  const varAssign = /\s*(\$[A-Za-z0-9_~])\s*=\s*(.*)/.exec(expr);

  if (varAssign) {
    const varName = varAssign[1];
    const varValue = varAssign[2];

    const expr = fx.compile(varValue)["expr"];
    fx.scope.setVariable(new FxScopeVariable(varName, expr, false));

    result = expr.evaluate();

  } else {
    result = fx.compile(expr).evaluate();
  }

  return result;
}

prompt();
