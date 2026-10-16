import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { JsonFx } from "../api/json-fx";
import { functionDocs } from "./docs";
import { builtinFunctions } from "./index";
import { functionReference, parameterNames } from "./reference";

describe("function reference", () => {
  it("documents every built-in (math~* are described generically) and nothing else", () => {
    const names = builtinFunctions.map(d => d.name).filter(n => !n.startsWith("math~"));
    expect(names.filter(n => !functionDocs[n])).toEqual([]);
    expect(Object.keys(functionDocs).filter(n => !names.includes(n))).toEqual([]);
  });

  it("docs/FUNCTIONS.md is current (run `npm run docs`)", () => {
    expect(readFileSync(join(__dirname, "..", "..", "docs", "FUNCTIONS.md"), "utf8")).toBe(functionReference());
  });

  it("reads parameter names", () => {
    const def = (name: string) => builtinFunctions.find(d => d.name === name)!;
    expect(parameterNames(def("add"))).toEqual(["a", "b"]);
    expect(parameterNames(def("sort"))).toEqual(["arr", "lambda"]);
    expect(parameterNames(def("neg"))).toEqual(["a"]);
    expect(parameterNames(def("splice"))).toEqual(["arr", "startIndex", "deleteCount", "...addItems"]);
  });

  it("every example of the form `expression → result` evaluates to its result", () => {
    const fx = new JsonFx();
    for (const [name, doc] of Object.entries(functionDocs)) {
      const m = /^(.*?) → (.*)$/.exec(doc.example ?? "");
      if (!m) { continue; }
      const actual = fx.compile(m[1]!).run({});
      expect(actual, name).toEqual(Function(`return (${m[2]})`)());
    }
  });
});
