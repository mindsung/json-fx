import * as fs from "fs";
import * as path from "path";

export function exportJSON(filename: string, json: any) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}
