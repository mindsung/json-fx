import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runCli } from "./cli";

let dir: string;

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "json-fx-cli-"));
  const put = (name: string, content: unknown, raw = false): void => {
    mkdirSync(join(dir, name, ".."), { recursive: true });
    writeFileSync(join(dir, name), raw ? (content as string) : JSON.stringify(content));
  };
  put("clean.template.json", { total: "$.items:map($i => $i.price):length" });
  put("clean.inputs.json", { $: { items: [] } });
  put("changed.template.json", { big: "1e3", n: "!$.a.b", kind: "order" });
  put("broken.template.json", { a: "toUpperCas('x')" });
  put("nested/deep.template.json", { "opt?": "$.x" });
  put("plain/only.json", "['a','b']");
  put("plain/only.inputs.json", {});
  put("bad-json.template.json", "{ not json", true);
  put("ext.js", "module.exports = [{ name: 'shout', evaluate: (s) => s + '!' }];", true);
  put("uses-ext.template.json", "'a':shout()");
});

afterAll(() => { rmSync(dir, { recursive: true, force: true }); });

function cli(...args: string[]): { code: number; out: string; err: string } {
  let out = "";
  let err = "";
  const code = runCli(args, { out: (t) => { out += t; }, err: (t) => { err += t; } });
  return { code, out, err };
}

describe("json-fx check", () => {
  it("a clean template exits 0", () => {
    const r = cli("check", join(dir, "clean.template.json"));
    expect(r.code).toBe(0);
    expect(r.out).toContain("1 template(s): 1 clean, 0 error(s)");
  });

  it("reports change findings (exit 0) and bare words, in a readable format", () => {
    const r = cli("check", join(dir, "changed.template.json"));
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/change\s+B7\s+big 1:1\s+Number literal '1e3'/);
    expect(r.out).toMatch(/change\s+B5\s+n 1:1/);
    expect(r.out).toMatch(/info\s+bare-word\s+kind/);
  });

  it("--quiet hides notes and --strict fails on change findings", () => {
    expect(cli("check", "--quiet", join(dir, "changed.template.json")).out).not.toContain("bare-word");
    expect(cli("check", "--strict", join(dir, "changed.template.json")).code).toBe(1);
    expect(cli("check", "--strict", join(dir, "clean.template.json")).code).toBe(0);
  });

  it("compile errors exit 1 and carry the suggestion", () => {
    const r = cli("check", join(dir, "broken.template.json"));
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/error\s+error\s+a /);
    expect(r.out).toContain("toUpperCase");
  });

  it("invalid JSON is an error finding, not a crash", () => {
    const r = cli("check", join(dir, "bad-json.template.json"));
    expect(r.code).toBe(1);
    expect(r.out).toContain("Not valid JSON");
  });

  it("a directory uses *.template.json (recursively) and skips *.inputs.json", () => {
    const r = cli("check", dir);
    expect(r.out).toContain(join(dir, "nested", "deep.template.json"));
    expect(r.out).toContain("C2");
    expect(r.out).not.toContain("clean.inputs.json");
    expect(r.out).not.toContain("only.json");
  });

  it("a directory without *.template.json files uses its *.json files", () => {
    const r = cli("check", join(dir, "plain"));
    expect(r.code).toBe(0);
    expect(r.out).toContain("only.json");
    expect(r.out).toContain("B6");
    expect(r.out).not.toContain("only.inputs.json");
  });

  it("--json prints a machine-readable report", () => {
    const r = cli("check", "--json", join(dir, "changed.template.json"), join(dir, "clean.template.json"));
    const parsed = JSON.parse(r.out) as Array<{ file: string; ok: boolean; findings: Array<{ rule: string }> }>;
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.findings.map(f => f.rule)).toEqual(expect.arrayContaining(["B7", "B5", "bare-word"]));
    expect(parsed[1]).toMatchObject({ ok: true, findings: [] });
  });

  it("--functions registers extension functions; without it the call is a compile error", () => {
    expect(cli("check", join(dir, "uses-ext.template.json")).code).toBe(1);
    expect(cli("check", "--functions", join(dir, "ext.js"), join(dir, "uses-ext.template.json")).code).toBe(0);
    expect(cli("check", "--functions", join(dir, "missing.js"), join(dir, "uses-ext.template.json")).code).toBe(64);
  });

  it("--inputs declares inputs and --globals defines globals", () => {
    writeFileSync(join(dir, "vars.template.json"), JSON.stringify({ a: "$order.id", b: "$config.x" }));
    expect(cli("check", join(dir, "vars.template.json")).code).toBe(0);
    expect(cli("check", "--inputs", "$", join(dir, "vars.template.json")).code).toBe(1);
    expect(cli("check", "--inputs", "$order", "--globals", "$config", join(dir, "vars.template.json")).code).toBe(0);
  });

  it("--strict-identifiers turns bare words into errors", () => {
    expect(cli("check", "--strict-identifiers", join(dir, "changed.template.json")).code).toBe(1);
  });

  it("usage errors exit 64 with the usage text", () => {
    for (const args of [[], ["bogus"], ["check"], ["check", "--nope", "x"], ["check", join(dir, "does-not-exist.json")], ["check", "--functions"]]) {
      const r = cli(...args);
      expect(r.code, args.join(" ")).toBe(64);
      expect(r.out + r.err).toMatch(/Usage|No such|Unknown|needs a value|No file/);
    }
    expect(cli("--help").code).toBe(0);
    expect(cli("check", "--help").code).toBe(0);
  });
});
