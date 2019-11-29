import { JsonFx } from "@mindsung/json-fx";
import * as fs from "fs";

export function cli(args) {
  const fx = new JsonFx();
  const dataFile = args[2];
  const tmplFile = args[3];
  if (!dataFile || !tmplFile) {
    console.error("usage: json-fx <input_file> <template_file>");
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(dataFile).toString());
  const tmpl = JSON.parse(fs.readFileSync(tmplFile).toString());
  console.log(fx.compile(tmpl).evaluate({ name: "$", value: data }));
}
