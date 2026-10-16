import type { FunctionRegistry } from "../api/registry";
import type { CompileOptions, FxFunctionDef, SourceRef } from "../api/types";
import { describe, FxError } from "../errors";
import { resolve } from "../semantics/resolve";
import type { Binding, FnRef, Node, ObjectNode } from "../syntax/ast";
import type { ParseNote } from "../syntax/parser";
import { Scanner, type Token } from "../syntax/scanner";
import { TemplateReader } from "../syntax/template-reader";
import { referencedBindings, visitNodes } from "../syntax/walk";

/**
 * Static checks behind `json-fx check` (V1-PLAN.md §7.1): compile errors with their suggestions, every Class B/C
 * construct whose meaning differs from v0, compile warnings, and the bare words that became string constants.
 *
 * `rule` is the plan's change id; `level` says how to read a finding:
 *  - `error`:   the template does not compile;
 *  - `change`:  v0 and v1 can produce different results for this construct (Class B/C), review it;
 *  - `warning`: compiles, but probably not what was meant;
 *  - `info`:    no action needed (bare words).
 */
export type FindingRule = "error" | "warning" | "bare-word" | "B2" | "B5" | "B6" | "B7" | "B13" | "B14" | "B15" | "B18" | "C1" | "C2" | "N1" | "N2";

export interface Finding {
  readonly rule: FindingRule;
  readonly level: "error" | "change" | "warning" | "info";
  readonly message: string;
  /** JSON path of the template value, e.g. `lines[0].total`; empty for the root. */
  readonly path: string;
  /** 1-based position within the expression string; 0 when the finding concerns a whole value or key. */
  readonly line: number;
  readonly column: number;
}

export interface CheckReport {
  /** No `error` findings: the template compiles. */
  readonly ok: boolean;
  readonly findings: readonly Finding[];
}

export interface CheckOptions extends Pick<CompileOptions, "inputs" | "strictIdentifiers"> {}

export interface CheckContext {
  readonly registry: FunctionRegistry;
  isGlobal(name: string): boolean;
  globalNames(): Iterable<string>;
}

const IDENTIFIER_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const keyPath = (path: string, key: string): string =>
  IDENTIFIER_KEY.test(key) ? (path ? `${path}.${key}` : key) : `${path}[${JSON.stringify(key)}]`;

function at(rule: FindingRule, level: Finding["level"], message: string, src: SourceRef): Finding {
  return { rule, level, message, path: src.path, line: src.line, column: src.column };
}

export function checkTemplate(template: unknown, ctx: CheckContext, options: CheckOptions = {}): CheckReport {
  const findings: Finding[] = [];
  const notes: ParseNote[] = [];

  // 1. Lexical rules. They need no compiled template, so they also report for templates that fail to compile.
  const scanner = new Scanner(ctx.registry.operatorSymbols());
  walkExpressions(template, "", (text, path) => { lexicalFindings(scanner, text, path, findings); }, (path) => {
    findings.push({ rule: "C2", level: "change", message: "Key ending in '?' is an optional key in v1: it is written without the '?' and omitted when its value is null or undefined", path, line: 0, column: 0 });
  });

  // 2. Compile, with the parser reporting the constructs only it can see.
  let ast: Node | undefined;
  try {
    ast = new TemplateReader(ctx.registry, (n) => { notes.push(n); }).read(template);
    const resolved = resolve(ast, ctx.registry, {
      ...(options.inputs ? { inputs: options.inputs } : {}),
      ...(options.strictIdentifiers ? { strictIdentifiers: true } : {}),
      isGlobal: (name) => ctx.isGlobal(name),
      globalNames: () => ctx.globalNames()
    });
    for (const w of resolved.warnings) { findings.push(at("warning", "warning", w.message, w.sourceRef)); }
    for (const b of resolved.bareWords) {
      findings.push(at("bare-word", "info", `'${b.word}' is a string constant (bare word); quote it, or use strictIdentifiers to make it an error`, b.sourceRef));
    }
  } catch (e) {
    if (!(e instanceof FxError)) { throw e; }
    ast = undefined;
    findings.push(e.sourceRef
      ? at("error", "error", stripLocation(e.message, e.sourceRef), e.sourceRef)
      : { rule: "error", level: "error", message: e.message, path: "", line: 0, column: 0 });
  }
  for (const n of notes) { findings.push(at(n.rule, "change", n.message, n.src)); }

  // 3. Rules over the resolved tree.
  if (ast) { analyze(ast, findings); }

  findings.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.line - b.line || a.column - b.column));
  return { ok: !findings.some(f => f.level === "error"), findings };
}

/** `FxError` messages end with " (at path, line L, column C)"; the finding carries that separately. */
const stripLocation = (message: string, ref: SourceRef): string => {
  const suffix = describe(ref);
  return suffix && message.endsWith(suffix) ? message.slice(0, -suffix.length) : message;
};

// ---- walking the raw template (mirrors TemplateReader) -------------------------------------------------------------

function walkExpressions(value: unknown, path: string, expression: (text: string, path: string) => void, optionalKey: (path: string) => void): void {
  if (typeof value === "string") { expression(value, path); return; }
  if (Array.isArray(value)) { value.forEach((item, i) => walkExpressions(item, `${path}[${i}]`, expression, optionalKey)); return; }
  if (value === null || typeof value !== "object") { return; }
  const obj = value as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("//")) { continue; }
    const valuePath = keyPath(path, key);
    const special = key === "()" || key.startsWith("$") || key.startsWith("@");
    if (!special && key.startsWith("{") && key.endsWith("}")) { expression(key.slice(1, -1), valuePath); }
    else if (!special && key.endsWith("?")) { optionalKey(valuePath); }
    walkExpressions(obj[key], valuePath, expression, optionalKey);
  }
}

function lexicalFindings(scanner: Scanner, text: string, path: string, out: Finding[]): void {
  let tokens: Token[];
  try { tokens = scanner.scan(text, path); } catch { return; } // a syntax error is reported by the compile step
  const where = (t: Token): SourceRef => ({ path, line: t.line, column: t.column, symbol: t.text });
  tokens.forEach((t, i) => {
    const next = tokens[i + 1];
    if (t.kind === "num" && /[eE]/.test(t.text)) {
      out.push(at("B7", "change", `Number literal '${t.text}' has an exponent: v0 read it as ${t.text.slice(0, t.text.search(/[eE]/))} followed by an identifier, v1 reads the number`, where(t)));
    } else if (t.kind === "str" && /\\['\\]/.test(t.text)) {
      out.push(at("B14", "change", `String literal ${t.text.length > 40 ? t.text.slice(0, 37) + "…'" : t.text} contains \\' or \\\\, which are escapes in v1 (v0 kept the backslash)`, where(t)));
    }
    // v0 read a quote that directly follows an operator character as part of the operator (probed against v0: every
    // operator, including `.`, `:` and `-`/`!` in prefix position, and `,`; not brackets).
    const operatorLike = (t.kind === "op" && !/^[A-Za-z_]+$/.test(t.text)) || (t.kind === "punct" && t.text === ",");
    if (operatorLike && next && next.kind === "str" && t.end === next.start) {
      out.push(at("B6", "change", `String literal directly after '${t.text}': v0 read the quote as part of the operator, so the expression came out wrong or failed; v1 reads a separate string. Add a space to make the intent explicit`, where(next)));
    }
  });
}

// ---- rules over the resolved tree ----------------------------------------------------------------------------------

interface DeclInfo {
  readonly name: string;
  readonly kind: "var" | "fn";
  readonly body: Node;
  readonly src: SourceRef;
}

const isFunctionArg = (n: Node): boolean => n.kind === "lambda" || (n.kind === "ref" && n.name.startsWith("@"));

function analyze(root: Node, out: Finding[]): void {
  const decls = new Map<Binding, DeclInfo>();
  const apply: Array<{ src: SourceRef; args: readonly Node[] }> = [];
  const impureOwn = new Map<Node, string[]>();

  const impureName = (fn: FnRef | undefined, symbolFallback?: string): string | undefined => {
    const def: FxFunctionDef | undefined = fn?.def;
    return def && !def.pure && !def.deferEvaluation ? (fn?.name ?? symbolFallback) : undefined;
  };

  visitNodes(root, (n) => {
    switch (n.kind) {
      case "object": registerDecls(n, decls); break;
      case "call":
        if (n.fn.name === "sort" && n.args.length >= 2 && isFunctionArg(n.args[1] as Node)) { out.push(sortFinding(n.src)); }
        if (n.fn.name === "toISOLocalDateTime") { out.push(timeFinding(n.src)); }
        break;
      case "apply": apply.push({ src: n.src, args: n.args }); break;
      case "chain":
        n.steps.forEach((s, i) => {
          if ((s.kind === "index" || s.kind === "pick") && (i > 0 || n.base.kind !== "ref")) { out.push(at("N2", "change", "Index or pick after another step: v0 ignored it or returned undefined here (only a variable base like '$a[0]' worked); v1 evaluates it as written", s.src)); }
        });
        for (const s of n.steps) {
          if (s.kind === "invoke" && s.fn.name === "sort" && s.args.length >= 1 && isFunctionArg(s.args[0] as Node)) { out.push(sortFinding(s.src)); }
          if (s.kind === "invoke" && s.fn.name === "toISOLocalDateTime") { out.push(timeFinding(s.src)); }
          if (s.kind === "invokeUser") { apply.push({ src: s.src, args: s.args }); }
        }
        break;
    }
    // Impure functions called directly by this node (its own call, not its children's).
    const names: string[] = [];
    if (n.kind === "call") { const x = impureName(n.fn); if (x) { names.push(x); } }
    else if (n.kind === "unary") { const x = impureName(n.op, n.op.symbol); if (x) { names.push(x); } }
    else if (n.kind === "binary") { const x = impureName(n.op, n.op.symbol); if (x) { names.push(x); } }
    else if (n.kind === "chain") { for (const s of n.steps) { if (s.kind === "invoke") { const x = impureName(s.fn); if (x) { names.push(x); } } } }
    if (names.length) { impureOwn.set(n, names); }
  });

  // B13 is reported above; B2: recursion and function arguments.
  const fnBindings = [...decls].filter(([, d]) => d.kind === "fn");
  const cache = new Map<Binding, Binding[]>();
  const edges = (b: Binding): Binding[] => referencedBindings((decls.get(b) as DeclInfo).body).filter(x => decls.has(x));
  for (const [binding, d] of fnBindings) {
    if (reaches(binding, binding, edges, cache)) {
      out.push(at("B2", "change", `Function '${d.name}' is recursive. v0 mis-evaluated recursion (functions were not re-entrant); v1 evaluates it correctly, so results that adapted to v0's output change`, d.src));
    }
  }
  for (const a of apply) {
    if (a.args.some(isFunctionArg)) {
      out.push(at("B2", "change", "A function or lambda is passed to a user function. v0 user functions were not re-entrant, so results may differ in v1 (may be affected)", a.src));
    }
  }

  // B15: an impure function reachable from a $var.
  for (const [binding, d] of decls) {
    if (d.kind !== "var") { continue; }
    const names = new Set<string>();
    const seen = new Set<Binding>([binding]);
    const stack: Node[] = [d.body];
    while (stack.length) {
      const body = stack.pop() as Node;
      visitNodes(body, (n) => { for (const x of impureOwn.get(n) ?? []) { names.add(x); } });
      for (const b of referencedBindings(body)) {
        const next = decls.get(b);
        if (next && !seen.has(b)) { seen.add(b); stack.push(next.body); }
      }
    }
    if (names.size) {
      out.push(at("B15", "change", `Variable '${d.name}' reaches impure function ${[...names].map(x => `'${x}'`).join(", ")}. v0 kept a variable's value across evaluate() calls; v1 recomputes it for every evaluation`, d.src));
    }
  }
}

const sortFinding = (src: SourceRef): Finding =>
  at("B13", "change", "'sort' with a key function: v1 sorts stably with a consistent comparator, so elements with equal keys may be ordered differently than in v0", src);

const timeFinding = (src: SourceRef): Finding =>
  at("N1", "change", "'toISOLocalDateTime' formats its first argument in v1 (v0 ignored it and formatted the current time) and defaults to the offset at that date", src);

function registerDecls(object: ObjectNode, decls: Map<Binding, DeclInfo>): void {
  if (!object.scope) { return; }
  for (const d of object.decls) {
    const binding = object.scope.bindings.get(d.name);
    if (binding) { decls.set(binding, { name: d.name, kind: d.kind, body: d.kind === "var" ? d.value : d.body, src: d.src }); }
  }
}

/** Whether `target` can be reached from `from` along `edges` (at least one step). */
function reaches(from: Binding, target: Binding, edges: (b: Binding) => Binding[], cache: Map<Binding, Binding[]>): boolean {
  const seen = new Set<Binding>();
  const stack = [...edgesOf(from, edges, cache)];
  while (stack.length) {
    const b = stack.pop() as Binding;
    if (b === target) { return true; }
    if (seen.has(b)) { continue; }
    seen.add(b);
    stack.push(...edgesOf(b, edges, cache));
  }
  return false;
}

function edgesOf(b: Binding, edges: (b: Binding) => Binding[], cache: Map<Binding, Binding[]>): Binding[] {
  let e = cache.get(b);
  if (!e) { e = edges(b); cache.set(b, e); }
  return e;
}
