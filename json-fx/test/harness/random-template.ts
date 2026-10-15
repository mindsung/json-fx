import { hostileString, Random } from "./random";

/**
 * Grammar-driven random templates for the differential test (V1-PLAN.md Phase 4 item 4). Typed so most programs are
 * valid and run to completion, with deliberate error sources (null dereferences, wrong types, `throw`) so the error
 * paths are compared too. Everything is derived from the seed.
 *
 * Inputs always have this shape (fields may be null/absent in some runs, see `randomInputs`):
 *   $ = { n: number, s: string, a: number[], o: { x: number, y: string|null }, items: { id, qty, name }[], nul: null }
 */

type Kind = "num" | "str" | "bool" | "arr" | "obj" | "any";

interface Var { name: string; kind: Kind; }
interface Fn { name: string; params: number; kind: Kind; /** The last parameter is a callable (`@cb`). */ callable?: boolean; }

interface Env {
  vars: Var[];
  fns: Fn[];
  /** Callable parameters (`@f`) in scope, with arity. */
  callables: Array<{ name: string; params: number }>;
}

const quote = (s: string): string => "'" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";

export interface RandomCase {
  template: unknown;
  /** Several input sets to run the one compiled template against. */
  inputs: Array<Record<string, unknown>>;
  /** Registered extension functions the template may use (names). */
  hostile: boolean;
}

export function randomInputs(rand: Random): Record<string, unknown> {
  const maybe = <T>(v: T, p = 0.1): T | null | undefined => (rand.chance(p) ? rand.pick([null, undefined] as const) : v);
  const item = (i: number) => ({ id: i, qty: maybe(rand.int(0, 5), 0.05), name: maybe(rand.pick(["a", "bb", "ccc", "Dd e", ""]), 0.05) });
  const dollar = {
    n: maybe(rand.int(-5, 20), 0.08),
    s: maybe(rand.pick(["", "abc", "Hello World", "x y z", hostileString(rand, 3)]), 0.08),
    a: maybe(Array.from({ length: rand.int(0, 5) }, () => rand.int(-3, 9)), 0.08),
    o: maybe({ x: maybe(rand.int(0, 9), 0.1), y: maybe(rand.pick(["p", "q", ""]), 0.2) }, 0.08),
    items: maybe(Array.from({ length: rand.int(0, 4) }, (_, i) => item(i)), 0.08),
    nul: null,
    fmt: (v: unknown) => "#" + String(v),
    inst: new HostObject()
  };
  const inputs: Record<string, unknown> = { $: rand.chance(0.05) ? maybe(dollar, 1) : dollar };
  if (rand.chance(0.7)) { inputs["$extra"] = rand.pick([1, "e", null, [1, 2], { k: "v" }]); }
  return inputs;
}

/** A class instance: `m` is inherited (blocked by the §4.6 rule), `own` is an own function property (allowed). */
class HostObject {
  public readonly own = (v: unknown): string => "own:" + String(v);
  public readonly data = 5;
  public m(): string { return "m"; }
}

class Generator {
  private counter = 0;
  public hostile = false;

  constructor(private readonly rand: Random) {}

  private fresh(prefix: string): string {
    return `${prefix}${this.counter++}`;
  }

  // ---- leaves ----------------------------------------------------------------------------------------------------

  private str(): string {
    const r = this.rand;
    if (r.chance(0.12)) { this.hostile = true; return quote(hostileString(r, 5).replace(/[\r\n]/g, " ")); }
    return quote(r.pick(["", "a", "abc", "Hello", "x y", "constructor", "__proto__", "it's", "a\\b"]));
  }

  private num(): string {
    const r = this.rand;
    return r.pick(["0", "1", "2", "3", "10", "100", "0.5", "1.5", "-1", "2.25", "1e3"]);
  }

  private pickVar(env: Env, kind: Kind): string | undefined {
    const ok = env.vars.filter(v => v.kind === kind || v.kind === "any");
    return ok.length ? this.rand.pick(ok).name : undefined;
  }

  // ---- expressions -----------------------------------------------------------------------------------------------

  public expr(kind: Kind, env: Env, d: number): string {
    const r = this.rand;
    if (kind === "any") { kind = r.pick<Kind>(["num", "str", "bool", "arr", "obj", "num", "str"]); }
    const leaf = d <= 0;
    switch (kind) {
      case "num": return leaf ? this.numLeaf(env) : this.numExpr(env, d);
      case "str": return leaf ? this.strLeaf(env) : this.strExpr(env, d);
      case "bool": return leaf ? this.boolLeaf(env) : this.boolExpr(env, d);
      case "arr": return leaf ? this.arrLeaf(env) : this.arrExpr(env, d);
      default: return leaf ? this.objLeaf(env) : this.objExpr(env, d);
    }
  }

  private numLeaf(env: Env): string {
    const r = this.rand;
    const v = this.pickVar(env, "num");
    return r.weighted<string>([
      [3, this.num()], [3, "$.n"], [1, "$.o.x"], [1, "$.a[0]"], [1, "$.items:length"], [1, "$.s:length"],
      [2, v ?? "$.n"], [0.3, "$.nul"], [0.3, "$.missing"], [0.3, "$.o.nope.deeper"], [0.5, "$extra"], [0.3, "$.n:toUpperCase"]
    ]);
  }

  private numExpr(env: Env, d: number): string {
    const r = this.rand;
    const sub = () => this.expr("num", env, d - 1);
    const fn = env.fns.filter(f => f.kind === "num");
    return r.weighted<() => string>([
      [4, () => `(${sub()} ${r.pick(["+", "-", "*", "/", "%", "+", "-"])} ${sub()})`],
      [1, () => `-${sub()}`],
      [1, () => `(${sub()} ** ${r.pick(["0", "1", "2"])})`],
      [2, () => `math~${r.pick(["round", "floor", "ceil", "abs", "sqrt"])}(${sub()})`],
      [1, () => `math~${r.pick(["min", "max"])}(${sub()}, ${sub()})`],
      [2, () => `(${sub()} if ${this.expr("bool", env, d - 1)} else ${sub()})`],
      [1, () => `ifElse(${this.expr("bool", env, d - 1)}, ${sub()}, ${sub()})`],
      [2, () => `${this.expr("arr", env, d - 1)}:length`],
      [2, () => `${this.expr("arr", env, d - 1)}:reduce(${this.lambda2(env, d - 1, "num")}, 0)`],
      [1, () => `${this.expr("arr", env, d - 1)}:${r.pick(["first", "last", "min", "max", "avg"])}()`],
      [1, () => `ifNull(${this.expr("any", env, d - 1)}, ${sub()})`],
      [1, () => `ifNullOrUndefined(${this.expr("any", env, d - 1)}, ${sub()})`],
      [1, () => `catch(${this.expr("any", env, d - 1)}, ${sub()})`],
      [fn.length ? 3 : 0, () => this.callFn(r.pick(fn), env, d - 1, () => sub())],
      [1, () => `${this.expr("obj", env, d - 1)}.${r.pick(["x", "qty", "id", "n", "nope", "data", "length", "constructor", "prototype", "__proto__"])}`],
      [0.7, () => `$.inst.${r.pick(["data", "m", "own", "constructor"])}${r.pick(["", "", "()"])}`],
      [0.7, () => `$.fmt(${sub()})`],
      [1, () => `${this.expr("arr", env, d - 1)}[${r.pick(["0", "1", "-1", "5"])}]`],
      [1, () => `${this.expr("str", env, d - 1)}:length`],
      [1, () => `(${this.expr("any", env, d - 1)})?.${r.pick(["x", "n", "length"])}`],
      [0.5, () => `${this.expr("arr", env, d - 1)}?:length`],
      [0.5, () => `notNull(${sub()})`]
    ])();
  }

  private strLeaf(env: Env): string {
    const v = this.pickVar(env, "str");
    return this.rand.weighted<string>([[3, this.str()], [3, "$.s"], [1, "$.o.y"], [2, v ?? "$.s"], [0.3, "$.nul"], [0.3, "$.n"], [0.5, "$extra"]]);
  }

  private strExpr(env: Env, d: number): string {
    const r = this.rand;
    const sub = () => this.expr("str", env, d - 1);
    const fn = env.fns.filter(f => f.kind === "str");
    return r.weighted<() => string>([
      [3, () => `(${sub()} + ${sub()})`],
      [1, () => `(${sub()} + ${this.expr("num", env, d - 1)})`],
      [2, () => `${sub()}:${r.pick(["toUpperCase", "toLowerCase", "trim", "toTitleCase", "toSnakeCase", "toCamelCase", "trimLeft", "trimRight"])}()`],
      [1, () => `${this.expr("num", env, d - 1)}:toString()`],
      [1, () => `${sub()}:substring(${r.pick(["0", "1", "2"])}, ${r.pick(["2", "3", "5"])})`],
      [1, () => `${sub()}:replace(${this.str()}, ${sub()})`],
      [1, () => `${this.expr("arr", env, d - 1)}:join(${this.str()})`],
      [2, () => `(${sub()} if ${this.expr("bool", env, d - 1)} else ${sub()})`],
      [1, () => `${sub()}:split(${this.str()}):join('-')`],
      [1, () => `ifNull(${this.expr("any", env, d - 1)}, ${sub()})`],
      [1, () => `catch(${this.expr("any", env, d - 1)}, ${sub()})`],
      [fn.length ? 2 : 0, () => this.callFn(r.pick(fn), env, d - 1, () => this.expr("any", env, d - 1))],
      [1, () => `${this.expr("obj", env, d - 1)}.${r.pick(["y", "name", "s", "nope"])}`],
      [0.5, () => `throw(${sub()})`]
    ])();
  }

  private boolLeaf(env: Env): string {
    const v = this.pickVar(env, "bool");
    return this.rand.weighted<string>([[2, "true"], [2, "false"], [2, "($.n > 3)"], [1, v ?? "false"], [1, "$.nul"], [0.5, "$extra"]]);
  }

  private boolExpr(env: Env, d: number): string {
    const r = this.rand;
    const sub = () => this.expr("bool", env, d - 1);
    return r.weighted<() => string>([
      [3, () => `(${this.expr("num", env, d - 1)} ${r.pick(["<", ">", "<=", ">=", "==", "!=", "===", "!=="])} ${this.expr("num", env, d - 1)})`],
      [1, () => `(${this.expr("str", env, d - 1)} ${r.pick(["==", "!=", "<", "==="])} ${this.expr("str", env, d - 1)})`],
      [2, () => `(${sub()} ${r.pick(["&&", "||"])} ${sub()})`],
      [1, () => `!${sub()}`],
      [1, () => `!!${this.expr("any", env, d - 1)}`],
      [1, () => `${this.expr("str", env, d - 1)}:${r.pick(["startsWith", "endsWith", "contains"])}(${this.str()})`],
      [1, () => `and(${sub()}, ${sub()})`],
      [1, () => `or(${sub()}, ${sub()})`],
      [1, () => `(${sub()} if ${sub()} else ${sub()})`]
    ])();
  }

  private arrLeaf(env: Env): string {
    const v = this.pickVar(env, "arr");
    return this.rand.weighted<string>([[3, "$.a"], [3, "$.items"], [1, "[]"], [1, "[1, 2, 3]"], [2, v ?? "$.a"], [0.3, "$.nul"], [0.3, "$.o"]]);
  }

  private arrExpr(env: Env, d: number): string {
    const r = this.rand;
    const sub = () => this.expr("arr", env, d - 1);
    return r.weighted<() => string>([
      [3, () => `[${Array.from({ length: r.int(0, 3) }, () => this.expr("any", env, d - 1)).join(", ")}]`],
      [3, () => `${sub()}:map(${this.lambda1(env, d - 1)})`],
      [2, () => `${sub()}:filter(${this.lambda1(env, d - 1, "bool")})`],
      [1, () => `${sub()}:sort(${this.lambda1(env, d - 1)})`],
      [1, () => `${sub()}:reverse()`],
      [1, () => `${sub()}:slice(0, ${r.pick(["1", "2", "3"])})`],
      [1, () => `${sub()}:concat(${sub()})`],
      [1, () => `range(0, ${r.int(0, 4)})`],
      [2, () => { const p = this.fresh("$p"); return `${this.expr("any", { ...env, vars: [...env.vars, { name: p, kind: "any" }] }, d - 1)} for ${p} in ${sub()}`; }],
      [1, () => `${sub()}?:map(${this.lambda1(env, d - 1)})`],
      [1, () => `${this.expr("obj", env, d - 1)}.${r.pick(["items", "a", "list"])}`],
      [0.5, () => `${this.expr("str", env, d - 1)}:split(${this.str()})`],
      [0.5, () => `(${sub()} if ${this.expr("bool", env, d - 1)} else ${sub()})`]
    ])();
  }

  private objLeaf(env: Env): string {
    const v = this.pickVar(env, "obj");
    return this.rand.weighted<string>([[3, "$.o"], [2, "$.items[0]"], [1, "{}"], [2, v ?? "$.o"], [0.3, "$.nul"], [0.3, "$"], [0.5, "$.inst"], [0.3, "$.a.map"], [0.3, "$.o.toString"], [0.2, "$.s.constructor"]]);
  }

  private objExpr(env: Env, d: number): string {
    const r = this.rand;
    return r.weighted<() => string>([
      [4, () => `{ ${Array.from({ length: r.int(0, 3) }, () => `${r.chance(0.1) ? "'__proto__'" : quote(r.pick(["a", "b", "c", "id", "k k", "constructor"]))}: ${this.expr("any", env, d - 1)}`).join(", ")} }`],
      [1, () => `assign(${this.expr("obj", env, d - 1)}, ${this.expr("obj", env, d - 1)})`],
      [1, () => `${this.expr("obj", env, d - 1)}{${r.pick(["x", "y", "x, y", "id, name", "constructor", "x, nope"])}}`],
      [1, () => `${this.expr("obj", env, d - 1)}?{x}`],
      [1, () => `${this.expr("arr", env, d - 1)}:find(${this.lambda1(env, d - 1, "bool")})`],
      [1, () => `${this.expr("arr", env, d - 1)}[${r.pick(["0", "1"])}]`],
      [1, () => `(${this.expr("obj", env, d - 1)} if ${this.expr("bool", env, d - 1)} else ${this.expr("obj", env, d - 1)})`],
      [1, () => `{ $v: ${this.expr("any", env, d - 1)}, (): $v }`],
      [0.5, () => `${this.expr("obj", env, d - 1)}[${this.str()}]`],
      [0.5, () => `${this.expr("obj", env, d - 1)}[${this.expr("str", env, d - 1)}]`],
      [0.5, () => `${this.expr("obj", env, d - 1)}[${this.str()}, ${this.str()}]`]
    ])();
  }

  private callFn(f: Fn, env: Env, d: number, arg: () => string): string {
    const args = Array.from({ length: f.params }, () => arg());
    if (f.callable) { args.push(this.rand.chance(0.5) ? this.lambda1(env, d) : this.rand.pick(env.fns.filter(g => g.params === 1 && !g.callable).map(g => g.name).concat(["@missingFn"]).filter(n => n !== "@missingFn" || this.rand.chance(0.05)).concat(["$.fmt"]))); }
    return `${f.name}(${args.join(", ")})`;
  }

  // ---- lambdas ---------------------------------------------------------------------------------------------------

  private lambda1(env: Env, d: number, kind: Kind = "any"): string {
    const p = this.fresh("$e");
    const inner: Env = { ...env, vars: [...env.vars, { name: p, kind: "any" }] };
    if (this.rand.chance(0.12) && env.callables.length) { return this.rand.pick(env.callables).name; }
    if (this.rand.chance(0.06)) { return this.rand.pick(["$.fmt", "$.inst.own", "$.inst.m", "$.a.map", "$extra"]); }
    if (this.rand.chance(0.1) && env.fns.length) { const f = this.rand.pick(env.fns); if (f.params === 1) { return `@${f.name.slice(1)}`; } }
    const body = this.rand.chance(0.7) ? this.expr(kind, inner, d) : `${p}${this.rand.pick([".qty", ".id", ".name", ".x", "", ".nope.deeper"])}`;
    return this.rand.chance(0.15) ? `(${p}) => ${body}` : `${p} => ${body}`;
  }

  private lambda2(env: Env, d: number, kind: Kind): string {
    const a = this.fresh("$acc");
    const b = this.fresh("$e");
    const inner: Env = { ...env, vars: [...env.vars, { name: a, kind: "any" }, { name: b, kind: "any" }] };
    const body = this.rand.chance(0.6) ? `(${a} + ${b})` : this.expr(kind, inner, d);
    return `(${a}, ${b}) => ${body}`;
  }

  // ---- templates -------------------------------------------------------------------------------------------------

  /** A template value: an expression string, a constant, a nested template object or an array of templates. */
  public value(env: Env, d: number): unknown {
    const r = this.rand;
    return r.weighted<() => unknown>([
      [6, () => this.expr("any", env, r.int(0, 3))],
      [1, () => r.pick([1, 0, true, false, null, "plain"])],
      [d > 0 ? 3 : 0, () => this.object(env, d - 1)],
      [d > 0 ? 1 : 0, () => Array.from({ length: r.int(0, 3) }, () => this.value(env, d - 1))]
    ])();
  }

  public object(outer: Env, d: number): Record<string, unknown> {
    const r = this.rand;
    const out: Record<string, unknown> = {};
    const env: Env = { vars: [...outer.vars], fns: [...outer.fns], callables: [...outer.callables] };

    // Variables only see earlier variables (no cycles); a function is added to the scope after its own body is generated.
    const decls = r.weighted<number>([[5, 0], [3, 1], [2, 2], [1, 3]]);
    for (let i = 0; i < decls; i++) {
      if (r.chance(0.65)) {
        const name = this.fresh("$v");
        out[name] = this.value(env, d - 1);
        env.vars.push({ name, kind: "any" });
      } else {
        const name = this.fresh("@f");
        const params = r.int(0, 2);
        const names = Array.from({ length: params }, () => this.fresh("$a"));
        const callable = r.chance(0.25) ? this.fresh("@cb") : undefined;
        const inner: Env = {
          ...env,
          vars: [...env.vars, ...names.map(n => ({ name: n, kind: "any" as Kind }))],
          callables: callable ? [...env.callables, { name: callable, params: 1 }] : env.callables
        };
        const kind = r.pick<Kind>(["num", "str", "any"]);
        const body = callable && r.chance(0.7) ? `${callable}(${this.expr("any", inner, 1)})` : undefined;
        const value = body ?? (r.chance(0.5) ? this.expr(kind, inner, r.int(0, 2)) : this.object(inner, d - 1));
        out[`${name}(${[...names, ...(callable ? [callable] : [])].join(", ")})`] = value;
        env.fns.push({ name, params, kind, ...(callable ? { callable: true } : {}) });
      }
    }

    const keys = r.int(0, 4);
    for (let i = 0; i < keys; i++) {
      const base = r.weighted<string>([[6, "k" + i], [1, "__proto__"], [1, "constructor"], [1, "a b"], [1, hostileString(r, 3).replace(/^[$@({[/]|\?$/, "z") || "h"]]);
      const kind = r.weighted<string>([[8, "static"], [1, "optional"], [d > 0 ? 2 : 0, "dynamic"]]);
      if (kind === "static") {
        out[base] = this.value(env, d);
      } else if (kind === "optional") {
        out[`${base.replace(/\?$/, "")}?`] = this.value(env, d);
      } else {
        const src = r.pick(["['A', 'B', 'C']", "{a: 1, b: 2}", "$.a", "$.o", "$.items:map($i => $i.name)", "'solo'", "$.nul", "[]"]);
        const names = r.weighted<string>([[2, ""], [2, " as $dv"], [3, " as $dv, $dk"]]);
        const inner: Env = { ...env, vars: [...env.vars, ...(names ? [{ name: "$dv", kind: "any" as Kind }] : []), ...(names.includes("$dk") ? [{ name: "$dk", kind: "any" as Kind }] : [])] };
        out[`{ ${src}${names} }`] = this.value(inner, d - 1);
      }
    }
    if (decls > 0 && keys === 0 && r.chance(0.6)) { out["()"] = this.expr("any", env, 2); }
    return out;
  }
}

/** One random template (root is an object most of the time) plus the input sets to run it against. */
export function randomCase(seed: number): RandomCase {
  const rand = new Random(seed);
  const gen = new Generator(rand);
  const env: Env = { vars: [], fns: [], callables: [] };
  const template = rand.weighted<() => unknown>([
    [8, () => gen.object(env, 2)],
    [2, () => gen.expr("any", env, 4)],
    [1, () => [gen.value(env, 1), gen.value(env, 1)]]
  ])();
  const inputs = Array.from({ length: 3 }, () => randomInputs(rand));
  return { template, inputs, hostile: gen.hostile };
}
