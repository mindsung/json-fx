import { $CABLE_DATA_1 } from "./sample/sources/cable-data";
import { JsonFx } from "./compiler/runtime/json-fx";
import { coreExpressions } from "./expressions/core";
import { mathExpressions } from "./expressions/math";
import { cableDataTemplate } from "./sample/cable-data-template";

// There's no need to implement this sandbox in a Mocha test
// Use Node.js run configuration w/ [Node parameters: --require ts-node/register]

const fs = require("fs");

const fx = new JsonFx(coreExpressions, mathExpressions);
const script = fx.compile(cableDataTemplate);

const output = script.evaluate({name: "$", value: $CABLE_DATA_1});
console.log(output);

fs.writeFile("./cable-1.json",
  JSON.stringify(output, null, 2),
  err => console.log(err));
