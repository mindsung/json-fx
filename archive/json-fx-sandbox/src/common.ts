import * as fs from "fs";
import * as path from "path";
import { JsonFx } from "@mindsung/json-fx";

export function fx(template: any, args: any[]): any {
  const fx = new JsonFx();
  const script = fx.compile(template);
  return script.evaluate(...args);
}

export function exportJSON(filename: string, json: any) {
  const dirname = path.dirname(filename);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}
