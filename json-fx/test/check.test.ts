import { describe, expect, it } from "vitest";
import { JsonFx, type Finding } from "../src";
import { loadCorpus } from "./harness/corpus";
import { makeTestFunctions } from "./harness/fixtures";

/**
 * `json-fx check` (V1-PLAN.md §7.1): every change class B/C difference recorded in the conformance corpus must be
 * reported for the template that shows it ("every Class B/C difference that can appear in a template is statically
 * detectable"), and templates the corpus says behave the same must not be flooded with change findings.
 */

/** Corpus bug id → rule reported by `check`. */
const RULE_OF: Record<string, string> = {
  B2: "B2", B5: "B5", B6: "B6", B7: "B7", B13: "B13", B14: "B14", B15: "B15", B18: "B18", B10: "C2"
};

const corpus = loadCorpus();

function check(template: unknown, functions: readonly string[] = []): readonly Finding[] {
  const defs = makeTestFunctions(functions).defs as any[];
  return new JsonFx({ functions: [defs] }).check(template).findings;
}

describe("check: every B/C difference in the corpus is detected", () => {
  const cases = corpus.filter(({ case: c }) => c.v0 === "differs" && (c.change === "B" || c.change === "C"));

  it("covers the corpus (guard against the filter silently matching nothing)", () => {
    expect(cases.length).toBeGreaterThanOrEqual(25);
  });

  for (const { case: c } of cases) {
    it(c.name, () => {
      const findings = check(c.template, c.functions);
      const rules = new Set(findings.map(f => f.rule));
      if (c.bug === undefined && c.name.startsWith("parentheses end")) { expect(rules).toContain("C1"); }
      else if (c.bug === "NEW" && /syntax error/.test(c.name)) { expect(rules).toContain("error"); }
      else if (c.bug === "NEW") { expect(rules.has("N1") || rules.has("N2"), `findings: ${JSON.stringify(findings)}`).toBe(true); }
      else { expect(rules, `findings: ${JSON.stringify(findings)}`).toContain(RULE_OF[c.bug as string]); }
    });
  }
});

describe("check: templates that behave the same in v0 and v1", () => {
  const same = corpus.filter(({ case: c }) => c.v0 === "same" && !c.options);

  it("are flagged only by the rules that over-approximate on purpose (B2 'may be affected', B13, B15)", () => {
    const flagged: string[] = [];
    const unexpected: string[] = [];
    for (const { case: c } of same) {
      const rules = check(c.template, c.functions).filter(f => f.level === "change").map(f => f.rule);
      if (rules.length) { flagged.push(c.name); }
      for (const r of rules) { if (!["B2", "B13", "B15"].includes(r)) { unexpected.push(`${c.name}: ${r}`); } }
    }
    expect(unexpected, unexpected.join("\n")).toEqual([]);
    expect(flagged.length / same.length, flagged.join("\n")).toBeLessThan(0.05);
  });
});

describe("check: rules", () => {
  const fx = new JsonFx();
  const rules = (template: unknown, options?: Parameters<JsonFx["check"]>[1]) => fx.check(template, options).findings.map(f => f.rule);

  it("B5: a prefix operator before a chain with steps, not before a parenthesized chain or a plain value", () => {
    expect(rules("!$.a.b")).toContain("B5");
    expect(rules("-$.x:abs")).toContain("B5");
    expect(rules("!($.a.b)")).not.toContain("B5");
    expect(rules("!$a")).not.toContain("B5");
    expect(rules("!!$.a.b")).toEqual(expect.arrayContaining(["B5"]));
  });

  it("B6: a string right after an operator character", () => {
    expect(rules("['a','b']")).toContain("B6");
    expect(rules("'a'+'b'")).toContain("B6");
    expect(rules("['a', 'b']")).not.toContain("B6");
    expect(rules("'a' + 'b'")).not.toContain("B6");
    expect(rules("$.a:startsWith('x')")).not.toContain("B6");
    expect(rules("{'k':'v'}")).toContain("B6");
    expect(rules("{'k': 'v'}")).not.toContain("B6");
    expect(rules("$.a['x']")).not.toContain("B6");
    expect(rules("$a['x']")).not.toContain("B6");
    expect(rules("$.s=='abc'")).toContain("B6");
    expect(rules("-'5'")).toContain("B6");
    expect(rules("['a']")).not.toContain("B6");
    expect(rules("{'a': 1}")).not.toContain("B6");
  });

  it("B7 and B14 are literal-level", () => {
    expect(rules("1e3")).toContain("B7");
    expect(rules("1.5e-2")).toContain("B7");
    expect(rules("1000")).not.toContain("B7");
    expect(rules("'it\\'s'")).toContain("B14");
    expect(rules("'a\\\\b'")).toContain("B14");
    expect(rules("'plain'")).not.toContain("B14");
  });

  it("B2: recursion, mutual recursion, and functions passed to user functions", () => {
    expect(rules({ "@f($n)": "@f($n - 1) if $n else 0", v: "@f(3)" })).toContain("B2");
    expect(rules({ "@even($n)": "@odd($n - 1)", "@odd($n)": "@even($n - 1)", v: "@even(2)" })).toContain("B2");
    expect(rules({ "@apply(@g, $x)": "@g($x)", v: "@apply($y => $y, 1)" })).toContain("B2");
    expect(rules({ "@double($n)": "$n * 2", v: "@double(2)" })).not.toContain("B2");
  });

  it("B15: an impure function reachable from a variable, also through functions and other variables", () => {
    expect(rules({ $t: "now()", v: "$t" })).toContain("B15");
    expect(rules({ "@stamp()": "math~random()", $t: "@stamp()", v: "$t" })).toContain("B15");
    expect(rules({ $a: "log('x', 1)", $b: "$a", v: "$b" })).toContain("B15");
    expect(rules({ v: "now()" })).not.toContain("B15");
    expect(rules({ $x: "$.a + 1", v: "$x" })).not.toContain("B15");
    expect(rules({ $x: "catch($.a.b, 1)", v: "$x" })).not.toContain("B15");
  });

  it("B13 and N1", () => {
    expect(rules("$.items:sort($i => $i.k)")).toContain("B13");
    expect(rules("sort($.items, $i => $i.k)")).toContain("B13");
    expect(rules("$.items:sort()")).not.toContain("B13");
    expect(rules("$.d:toISOLocalDateTime(0)")).toContain("N1");
  });

  it("N2: an index or pick after another step, not on a plain variable", () => {
    expect(rules("$.arr[0]")).toContain("N2");
    expect(rules("$.o{x}")).toContain("N2");
    expect(rules("($.o)['x']")).toContain("N2");
    expect(rules("$a['x']['y']")).toContain("N2");
    expect(rules("$a[0]")).not.toContain("N2");
    expect(rules("$a{x}")).not.toContain("N2");
  });

  it("B18: an unparenthesized else-if chain", () => {
    expect(rules("1 if $a else 2 if $b else 3")).toContain("B18");
    expect(rules("1 if $a else (2 if $b else 3)")).not.toContain("B18");
    expect(rules("1 if $a else 2")).not.toContain("B18");
  });

  it("C1 and C2", () => {
    expect(rules("($a?.b).c")).toContain("C1");
    expect(rules("($a.b).c")).not.toContain("C1");
    expect(rules("$a?.b.c")).not.toContain("C1");
    expect(rules({ "nick?": "$.n" })).toContain("C2");
    expect(rules({ nick: "$.n" })).not.toContain("C2");
    expect(rules({ "$v?": 1 })).not.toContain("C2");
  });

  it("rules also fire inside dynamic keys, nested objects and arrays, with their paths", () => {
    const findings = fx.check({ a: { b: ["1e3"] }, "{ ['x','y'] as $v }": "$v" }).findings;
    expect(findings.find(f => f.rule === "B7")?.path).toBe("a.b[0]");
    expect(findings.find(f => f.rule === "B6")?.path).toBe('["{ [\'x\',\'y\'] as $v }"]');
  });

  it("compile errors are findings with suggestions, and lexical rules still report", () => {
    const report = fx.check({ a: "toUpperCas('x')", b: "1e3" });
    expect(report.ok).toBe(false);
    const error = report.findings.find(f => f.rule === "error");
    expect(error?.level).toBe("error");
    expect(error?.message).toContain("toUpperCase");
    expect(error?.message).not.toMatch(/\(at /);
    expect(error?.path).toBe("a");
    expect(report.findings.map(f => f.rule)).toContain("B7");
  });

  it("syntax errors, cycles, undefined variables with declared inputs", () => {
    expect(fx.check("'abc").ok).toBe(false);
    expect(fx.check({ $a: "$b", $b: "$a", v: "$a" }).ok).toBe(false);
    const report = fx.check("$nope", { inputs: ["$", "$order"] });
    expect(report.ok).toBe(false);
    expect(report.findings[0]?.message).toContain("$nope");
  });

  it("bare words are informational; strictIdentifiers makes them errors", () => {
    const report = fx.check({ kind: "order" });
    expect(report.ok).toBe(true);
    expect(report.findings).toEqual([expect.objectContaining({ rule: "bare-word", level: "info", path: "kind" })]);
    expect(fx.check({ kind: "order" }, { strictIdentifiers: true }).ok).toBe(false);
  });

  it("a clean template has no findings, and check never throws", () => {
    expect(fx.check({ total: "$.items:map($i => $i.price * $i.qty):reduce(($a, $b) => $a + $b, 0)" })).toEqual({ ok: true, findings: [] });
    for (const bad of [undefined, () => 1, Symbol("x"), { "{": 1 }, { "@": 1 }, { "$": 1 }, { "{ as }": 1 }]) {
      expect(() => fx.check(bad)).not.toThrow();
    }
  });
});
