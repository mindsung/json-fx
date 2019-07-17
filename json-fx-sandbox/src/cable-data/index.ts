import { JsonFx } from "@mindsung/json-fx";
import { exportJSON } from "../common";
import { CableData } from "./cable-data";
import { CableDataTemplate } from "./cable-data-template";
import * as path from "path";

const fx = new JsonFx();
const script = fx.compile(CableDataTemplate);

const output = script.evaluate({ name: "$", value: CableData });

exportJSON(path.resolve(__dirname, "out/cable-data.json"), output);

let print = JSON.stringify(output, null, 2);
if (print.length > 10000) {
  print = print.substr(0, 9997) + "...";
}

console.log(print);
