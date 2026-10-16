import type { SourceRef } from "../../api/types";
import {
  callable, cyclicReference, dynamicEntries, get, getBlocked, getDynamic, index, isBlockedKey, own, pick, setOwn, toKey,
  undefinedInput, wrap
} from "../../runtime/helpers";
import type { Binding, CallNode, Decl, Field, LambdaNode, Node, ObjectNode, RefNode, Step } from "../../syntax/ast";
import { factoryName, keyLiteral, literal, member, Names, propKey, sanitizeName, str } from "./emit";

/**
 * The JS code generator (V1-PLAN.md §5.8). Input: the resolved AST. Output: the source of a factory body
 * `(K, R, G) => (I) => result`, where `K` holds the constants (functions, source references), `R` the runtime helpers,
 * `G` the globals and `I` the inputs of a run. `backend/closure/compile.ts` is the semantic reference.
 *
 * Shape of the generated code:
 *  - Every scope is a JS scope: bindings become generator-made identifiers, so the resolver's frames and depths are
 *    not needed. Object variables are memoizing thunks (`v3()`), functions plain arrows.
 *  - Expressions are self-delimiting strings. An object or array literal is inlined only where nothing that can throw
 *    is evaluated after it inside the same error-wrapping point ("tail" position); anywhere else it becomes an
 *    immediately invoked function. Objects with declarations, optional or dynamic fields, or an output are generated as
 *    statements (the body of a function, or of such an immediately invoked function).
 *  - Error attribution matches the closure backend (innermost source reference wins, V1-PLAN deviation 24): each
 *    function that contains wrapping points keeps `s`, the source reference of the wrapping point being evaluated,
 *    assigned just before it, and one `try/catch` per function wraps with it. `s` is only ever assigned by code that
 *    runs directly in the function that declares it (nested literals share it only in tail position; lazy arguments
 *    are never tail), so a caught-and-recovered error can't leave it stale.
 */

export const RUNTIME = {
  wrap, own, getBlocked, getDynamic, index, pick, setOwn, dyn: dynamicEntries, fn: callable, cyclic: cyclicReference,
  missing: undefinedInput
};

type HelperName = keyof typeof RUNTIME;

export interface GeneratedCode {
  /** Body for `new Function("K", "R", "G", source)`; evaluates to the template function. */
  readonly source: string;
  /** The `K` argument. */
  readonly constants: readonly unknown[];
}

interface FnState {
  readonly temps: string[];
  usesS: boolean;
}

const isComplexObject = (n: ObjectNode): boolean =>
  n.decls.length > 0 || n.output !== undefined || n.fields.some(f => f.kind === "dynamic" || f.optional);

/**
 * Whether evaluating the node can throw an error that carries no source reference (and so needs a wrapping point).
 * Arrays and objects wrap their own parts; inputs throw with a reference already.
 */
function mayThrow(node: Node): boolean {
  switch (node.kind) {
    case "literal": case "lambda": case "array": case "object": return false;
    case "ref": return node.binding?.kind === "var";
    default: return true;
  }
}

export function generate(root: Node, options: { name?: string | undefined } = {}): GeneratedCode {
  return new Generator().generate(root, options.name);
}

class Generator {
  private readonly names = new Names();
  private readonly constants: unknown[] = [];
  private readonly constIds = new Map<unknown, string>();
  private readonly helpersUsed = new Set<HelperName>();
  private readonly ids = new Map<Binding, string>();
  private readonly declIds = new Map<Decl, string>();
  private fn: FnState = { temps: [], usesS: false };

  public generate(root: Node, name: string | undefined): GeneratedCode {
    const body = this.body(root.src, () => this.returnBody(root));
    const consts = this.constants.map((_, i) => `k${i} = K[${i}]`);
    const helpers = [...this.helpersUsed].map(h => `h_${h} = R.${h}`);
    const decls = [...consts, ...helpers];
    const source = [
      "\"use strict\";",
      decls.length ? `const ${decls.join(", ")};` : "",
      `return function ${factoryName(name)}(I) {`,
      body,
      "};",
      `//# sourceURL=jsonfx://${sanitizeName(name)}.js`
    ].filter(Boolean).join("\n");
    return { source, constants: this.constants };
  }

  // ---- bookkeeping -----------------------------------------------------------------------------------------------

  private konst(value: unknown): string {
    let id = this.constIds.get(value);
    if (id === undefined) {
      id = `k${this.constants.length}`;
      this.constants.push(value);
      this.constIds.set(value, id);
    }
    return id;
  }

  private h(name: HelperName): string {
    this.helpersUsed.add(name);
    return `h_${name}`;
  }

  private src(ref: SourceRef): string {
    return this.konst(ref);
  }

  private temp(): string {
    const id = this.names.id("t");
    this.fn.temps.push(id);
    return id;
  }

  /** `s = <src>`: marks the start of a wrapping point in the current function. */
  private mark(ref: SourceRef): string {
    this.fn.usesS = true;
    return `s = ${this.src(ref)}`;
  }

  private bind(binding: Binding | undefined, prefix: string): string {
    const id = this.names.id(prefix);
    if (binding) { this.ids.set(binding, id); }
    return id;
  }

  private idOf(binding: Binding): string {
    return this.ids.get(binding) as string;
  }

  /**
   * The statements of a function body: temporaries, and when the function has wrapping points (or is one itself,
   * `init`), the `s` tracker with the try/catch that wraps errors. `onError` runs first in the catch.
   */
  private body(init: SourceRef | undefined, build: () => string, onError = ""): string {
    const saved = this.fn;
    const state: FnState = { temps: [], usesS: false };
    this.fn = state;
    let statements: string;
    try { statements = build(); } finally { this.fn = saved; }

    const wrapping = init !== undefined || state.usesS;
    const lets = [...(wrapping ? [`s = ${init ? this.src(init) : "undefined"}`] : []), ...state.temps];
    const decl = lets.length ? `let ${lets.join(", ")};\n` : "";
    if (!wrapping) { return decl + statements; }
    const wrapCall = `${this.h("wrap")}(e, s)`;
    return `${decl}try {\n${statements}\n} catch (e) { ${onError}throw ${init ? wrapCall : `s === undefined ? e : ${wrapCall}`}; }`;
  }

  /** A body that returns the node's value; objects that need statements get them directly instead of an IIFE. */
  private returnBody(node: Node): string {
    if (node.kind === "object" && isComplexObject(node)) { return this.objectStatements(node); }
    return `return ${this.expr(node, true)};`;
  }

  private iife(node: Node): string {
    return `(() => {\n${this.body(undefined, () => this.returnBody(node))}\n})()`;
  }

  // ---- expressions -----------------------------------------------------------------------------------------------

  /**
   * `tail`: nothing that can throw runs after this expression within the current wrapping point, so a literal may
   * set `s` for its own parts.
   */
  private expr(node: Node, tail: boolean): string {
    switch (node.kind) {
      case "literal": return literal(node.value);
      case "ref": return this.ref(node);
      case "array": return tail ? this.arrayLiteral(node.items) : this.iife(node);
      case "object": return tail && !isComplexObject(node) ? this.objectLiteral(node) : this.iife(node);
      case "lambda": return this.lambda(node);
      case "call": return this.call(node);
      case "lazyCall": {
        const args = node.args.map(a => `{ evaluate: () => ${this.expr(a, false)}, sourceRef: ${this.src(a.src)} }`);
        return `${this.konst(node.fn.def!.evaluate)}(${args.join(", ")})`;
      }
      case "apply": return `${this.callee(node.callee)}(${node.args.map(a => this.expr(a, false)).join(", ")})`;
      case "chain": return this.chain(node.base, node.steps);
      case "unary": return this.invoke(node.op.def!, [this.expr(node.operand, false)]);
      case "binary": return this.invoke(node.op.def!, [this.expr(node.left, false), this.expr(node.right, false)]);
      case "logical": return `(${this.expr(node.left, false)} ${node.op} ${this.expr(node.right, tail)})`;
      case "cond": return `(${this.expr(node.test, false)} ? ${this.expr(node.then, tail)} : ${this.expr(node.else, tail)})`;
    }
  }

  /** A call of a registered function with generated arguments: inline if the built-in has an `emit`, else through `K`. */
  private invoke(def: NonNullable<CallNode["fn"]["def"]>, args: string[]): string {
    return def.emit?.(args) ?? `${this.konst(def.evaluate)}(${args.join(", ")})`;
  }

  private call(node: CallNode): string {
    return this.invoke(node.fn.def!, node.args.map(a => this.expr(a, false)));
  }

  private ref(node: RefNode): string {
    const b = node.binding as Binding;
    switch (b.kind) {
      case "input": {
        const name = str(b.name);
        return `(${name} in I ? I[${name}] : ${this.h("missing")}(${name}, ${this.src(node.src)}))`;
      }
      case "global": return `G.get(${str(b.name)})`;
      case "var": return `${this.idOf(b)}()`;
      default: return this.idOf(b);
    }
  }

  /** The callee of an `@f(...)` call: a function declaration is known to be one, anything else is checked at run time. */
  private callee(node: Node): string {
    if (node.kind === "ref" && node.binding?.kind === "fn") { return this.idOf(node.binding); }
    const name = node.kind === "ref" ? node.name : "value";
    return `${this.h("fn")}(${this.expr(node, false)}, ${str(name)}, ${this.src(node.src)})`;
  }

  // ---- arrays and objects ----------------------------------------------------------------------------------------

  /** An expression for a value in a wrapping point (array item, field value): sets `s` first if it can throw. */
  private wrapped(node: Node): string {
    const value = this.expr(node, true);
    return mayThrow(node) ? `(${this.mark(node.src)}, ${value})` : value;
  }

  private arrayLiteral(items: Node[]): string {
    return `[${items.map(i => this.wrapped(i)).join(", ")}]`;
  }

  private objectLiteral(node: ObjectNode): string {
    const entries = node.fields.map(f => {
      const field = f as Extract<Field, { kind: "static" }>;
      return `${propKey(field.key)}: ${this.wrapped(field.value)}`;
    });
    return entries.length ? `{ ${entries.join(", ")} }` : "{}";
  }

  /** Statements for an object that can't be a literal; the last one returns its value. */
  private objectStatements(node: ObjectNode): string {
    const out: string[] = [];
    for (const d of node.decls) { this.declare(d, node); }
    for (const d of node.decls) { out.push(d.kind === "var" ? this.varDecl(d) : this.fnDecl(d)); }

    if (node.output) {
      const value = this.expr(node.output, true);
      out.push(`${mayThrow(node.output) ? `${this.mark(node.output.src)}; ` : ""}return ${value};`);
      return out.join("\n");
    }

    const o = this.names.id("o");
    out.push(`const ${o} = {};`);
    for (const f of node.fields) { out.push(f.kind === "static" ? this.staticField(o, f) : this.dynamicField(o, f)); }
    out.push(`return ${o};`);
    return out.join("\n");
  }

  private assign(o: string, key: string, value: string): string {
    return key === "__proto__" ? `${this.h("setOwn")}(${o}, ${str(key)}, ${value});` : `${member(o, key)} = ${value};`;
  }

  private staticField(o: string, f: Extract<Field, { kind: "static" }>): string {
    const value = this.expr(f.value, true);
    const mark = mayThrow(f.value) ? `${this.mark(f.value.src)}; ` : "";
    if (!f.optional) { return mark + this.assign(o, f.key, value); }
    const t = this.temp();
    return `${mark}${t} = ${value};\nif (${t} != null) { ${this.assign(o, f.key, t)} }`;
  }

  private dynamicField(o: string, f: Extract<Field, { kind: "dynamic" }>): string {
    const entry = this.names.id("d");
    const source = this.expr(f.source, false);
    const decls: string[] = [];
    if (f.valueName !== undefined) { decls.push(`const ${this.bind(f.scope?.bindings.get(f.valueName), "p")} = ${entry}.value;`); }
    if (f.keyName !== undefined) { decls.push(`const ${this.bind(f.scope?.bindings.get(f.keyName), "p")} = ${entry}.index;`); }
    const value = this.expr(f.value, true);
    const mark = mayThrow(f.value) ? `${this.mark(f.value.src)}; ` : "";
    return `${this.mark(f.source.src)};\nfor (const ${entry} of ${this.h("dyn")}(${source})) {\n${decls.join(" ")}${decls.length ? "\n" : ""}${mark}${this.h("setOwn")}(${o}, ${entry}.key, ${value});\n}`;
  }

  // ---- declarations, functions ----------------------------------------------------------------------------------

  private declare(d: Decl, object: ObjectNode): void {
    this.declIds.set(d, this.bind(object.scope?.bindings.get(d.name), d.kind === "var" ? "v" : "f"));
  }

  /** A lazy, memoized variable: `v3()`; `w` is its state (0 unset, 1 computing, 2 done) and `x` its value. */
  private varDecl(d: Extract<Decl, { kind: "var" }>): string {
    const v = this.declIds.get(d) as string;
    const w = this.names.id("w");
    const x = this.names.id("x");
    const body = this.body(d.value.src, () => `${x} = ${this.expr(d.value, true)};\n${w} = 2;\nreturn ${x};`, `${w} = 0; `);
    return `let ${w} = 0, ${x};\nconst ${v} = () => {\nif (${w} === 2) { return ${x}; }\nif (${w} === 1) { ${this.h("cyclic")}(${str(d.name)}); }\n${w} = 1;\n${body}\n};`;
  }

  private fnDecl(d: Extract<Decl, { kind: "fn" }>): string {
    const f = this.declIds.get(d) as string;
    const params = d.params.map(p => this.bind(d.scope?.bindings.get(p.name), "p"));
    const body = this.body(d.body.src, () => this.normalize(params) + this.returnBody(d.body));
    return `const ${f} = (${params.join(", ")}) => {\n${body}\n};`;
  }

  private normalize(params: string[]): string {
    return params.map(p => `if (${p} === undefined) { ${p} = null; }\n`).join("");
  }

  private lambda(node: LambdaNode): string {
    const params = node.params.map(p => this.bind(node.scope?.bindings.get(p.name), "p"));
    const body = this.body(undefined, () => this.normalize(params) + this.returnBody(node.body));
    return `((${params.join(", ")}) => {\n${body}\n})`;
  }

  // ---- chains ---------------------------------------------------------------------------------------------------

  private chain(baseNode: Node, steps: Step[]): string {
    const t = this.temp();
    const u = steps.some(s => s.kind === "prop" || (s.kind === "index" && !s.multi)) ? this.temp() : "";
    const rest = (i: number): string => {
      const step = steps[i];
      if (!step) { return t; }
      const inner = `(${this.step(step, t, u)}, ${rest(i + 1)})`;
      return step.guard ? `(${t} == null ? null : ${inner})` : inner;
    };
    return `(${t} = ${this.expr(baseNode, false)}, ${rest(0)})`;
  }

  /** A read of a key known at generation time, with the hardening of `helpers.get` inlined. */
  private staticRead(t: string, u: string, key: string | number): string {
    if (typeof key === "string" && isBlockedKey(key)) { return `${t} = ${this.h("getBlocked")}(${t}, ${str(key)})`; }
    return `${t} = ${member(`(${u} = ${t})`, key)}, typeof ${t} === "function" && !${this.h("own")}(${u}, ${keyLiteral(key)}) && (${t} = undefined)`;
  }

  /** An expression that assigns the value after the step to `t`. */
  private step(step: Step, t: string, u: string): string {
    switch (step.kind) {
      case "prop": return this.staticRead(t, u, step.key);
      case "index": {
        const keys = step.keys.map(k => this.expr(k, false));
        if (step.multi) { return `${t} = ${this.h("index")}(${t}, [${keys.join(", ")}])`; }
        const only = step.keys[0] as Node;
        if (only.kind === "literal") {
          const key = toKey(only.value);
          if (typeof key !== "symbol") { return this.staticRead(t, u, key); }
        }
        return `${t} = ${this.h("getDynamic")}(${t}, ${keys[0]})`;
      }
      case "pick": return `${t} = ${this.h("pick")}(${t}, [${step.keys.map(k => this.expr(k, false)).join(", ")}])`;
      case "invoke": return `${t} = ${this.invoke(step.fn.def!, [t, ...step.args.map(a => this.expr(a, false))])}`;
      case "invokeUser": return `${t} = ${this.callee(step.callee)}(${[t, ...step.args.map(a => this.expr(a, false))].join(", ")})`;
    }
  }
}

export type TemplateFn = (inputs: Record<string, unknown>) => any;

export interface CompiledJs {
  readonly run: TemplateFn;
  readonly source: string;
}

/** Whether `new Function` works here (it doesn't under a strict CSP or in some edge runtimes). */
export function canGenerate(): boolean {
  try {
    return new Function("return 1")() === 1;
  } catch {
    return false;
  }
}

/** Generates and instantiates the template function. `globals` is read on every run, not copied. */
export function compileCodegen(root: Node, globals: ReadonlyMap<string, unknown>, name?: string): CompiledJs {
  const { source, constants } = generate(root, { name });
  const factory = new Function("K", "R", "G", source) as (k: readonly unknown[], r: typeof RUNTIME, g: ReadonlyMap<string, unknown>) => TemplateFn;
  return { run: factory(constants, RUNTIME, globals), source };
}
