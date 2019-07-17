import * as fs from "fs";
import * as path from "path";

export function exportJSON(filename: string, json: any) {
  const dirname = path.dirname(filename);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}
