import {JsonFx} from "../..";
import fs from "fs";

const jsonfx = new JsonFx();
const script = fs.readFileSync("../examples/03-advanced.fx").toString();

console.time("compile");
const code = jsonfx.compile(script);
console.timeEnd("compile");
console.time("evaluate");
const e = code.evaluate();
console.timeEnd("evaluate");
console.log(e);
