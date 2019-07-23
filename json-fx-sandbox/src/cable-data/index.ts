import { exportJSON, fx } from "../common";
import { CableData } from "./cable-data";
import * as path from "path";
import { CableDataTemplate } from "./cable-data-template";

const start = process.hrtime();
for (let i = 0; i < 1000; i++) {
  const out = fx(CableDataTemplate, [{ name: "$", value: CableData }]);
}
const end = process.hrtime(start);
console.info("Execution time (hr): %ds", (end[0] + end[1] / 1000000000).toFixed(3));

// const json = JSON.stringify(out, null, 2);

// exportJSON(path.resolve(__dirname, "out/cable-data.json"), json);
// console.log(json.substr(0, 10000));
