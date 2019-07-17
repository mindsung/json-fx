import { CableDataTemplate } from "./cable-data-template";
import { CableData } from "./cable-data";
import { JsonFx } from "@mindsung/json-fx";
import { exportJSON } from "../utils";
import * as path from "path";

const fx = new JsonFx();
const script = fx.compile(CableDataTemplate);

const output = script.evaluate({ name: "$", value: CableData });

exportJSON(path.resolve(__dirname, "out/cable-data.json"), output);
console.log(output);
