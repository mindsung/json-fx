import type { FunctionRegistry } from "../api/registry";
import type { CompileOptions, SourceRef } from "../api/types";
import { FxCompileError } from "../errors";
import type { Binding, Decl, FnRef, Node, ObjectNode, Param, RefNode, ScopeInfo, Step } from "../syntax/ast";
import { didYouMean } from "./suggest";

export interface FxWarning {
  readonly message: string;
  readonly sourceRef: SourceRef;
}

export interface BareWord {
  readonly word: string;
  readonly sourceRef: SourceRef;
}

export interface ResolveResult {
  /** Non-fatal findings (arity mismatches). */
  readonly warnings: FxWarning[];
  /** Every identifier that became a string constant (`"kind": "order"`); `json-fx check` lists them. */
  readonly bareWords: BareWord[];
}

export interface ResolveOptions extends Pick<CompileOptions, "inputs" | "strictIdentifiers"> {
  /** Whether `$name` is a global of the `JsonFx` instance. */
  readonly isGlobal?: (name: string) => boolean;
  /** Names of all globals, for suggestions. */
  readonly globalNames?: () => Iterable<string>;
}

/** The pseudo-scope of inputs and globals. */
const ROOT: ScopeInfo = { id: 0, kind: "root", parent: undefined, bindings: new Map(), slots: 0 };

/**
 * Binds every reference to a declaration (V1-PLAN.md §5.6): builds the scope tree, sets `binding`/`depth` on `ref`
 * nodes and `scope` on the nodes that own a frame, and reports unknown names, cycles, duplicate declarations and
 * arity problems. Mutates the AST in place.
 */
export function resolve(root: Node, registry: FunctionRegistry, options: ResolveOptions = {}): ResolveResult {
  return new Resolver(registry, options).run(root);
}

class Resolver {
  private nextId = 1;
  private readonly warnings: FxWarning[] = [];
  private readonly bareWords: BareWord[] = [];
  private readonly declared: Set<string> | undefined;

  constructor(private readonly registry: FunctionRegistry, private readonly options: ResolveOptions) {
    this.declared = options.inputs ? new Set(options.inputs) : undefined;
  }

  public run(root: Node): ResolveResult {
    this.visit(root, undefined);
    return { warnings: this.warnings, bareWords: this.bareWords };
  }

  // ---- scopes -------------------------------------------------------------------------------------------------

  private newScope(kind: ScopeInfo["kind"], parent: ScopeInfo | undefined): ScopeInfo {
    return { id: this.nextId++, kind, parent, bindings: new Map(), slots: 0 };
  }

  private declare(scope: ScopeInfo, name: string, kind: Binding["kind"], src: SourceRef): Binding {
    if (scope.bindings.has(name)) { throw new FxCompileError(`'${name}' is declared more than once in the same scope`, src); }
    const binding: Binding = { name, scope, kind, slot: scope.slots++ };
    scope.bindings.set(name, binding);
    return binding;
  }

  /** Scope for a list of parameters, or `undefined` when there are none (no frame needed). */
  private paramScope(kind: "lambda" | "dynamic", params: readonly { name: string }[], parent: ScopeInfo | undefined, src: SourceRef): ScopeInfo | undefined {
    if (!params.length) { return undefined; }
    const scope = this.newScope(kind, parent);
    for (const p of params) { this.declare(scope, p.name, "param", src); }
    return scope;
  }

  private lookup(name: string, from: ScopeInfo | undefined): { binding: Binding; depth: number } | undefined {
    let depth = 0;
    for (let s = from; s; s = s.parent, depth++) {
      const binding = s.bindings.get(name);
      if (binding) { return { binding, depth }; }
    }
    return undefined;
  }

  private visibleNames(from: ScopeInfo | undefined, sigil: string): string[] {
    const names: string[] = [];
    for (let s = from; s; s = s.parent) {
      for (const name of s.bindings.keys()) { if (name.startsWith(sigil)) { names.push(name); } }
    }
    return names;
  }

  // ---- references ---------------------------------------------------------------------------------------------

  private resolveRef(node: RefNode, scope: ScopeInfo | undefined): void {
    const found = this.lookup(node.name, scope);
    if (found) {
      node.binding = found.binding;
      node.depth = found.depth;
      return;
    }

    if (node.name.startsWith("@")) {
      throw new FxCompileError(`Undefined function '${node.name}'.${didYouMean(node.name, this.visibleNames(scope, "@"))}`, node.src);
    }

    const name = node.name;
    if (this.declared?.has(name)) {
      node.binding = { name, scope: ROOT, kind: "input", slot: -1 };
    } else if (this.options.isGlobal?.(name)) {
      node.binding = { name, scope: ROOT, kind: "global", slot: -1 };
    } else if (this.declared) {
      const candidates = [...this.declared, ...this.visibleNames(scope, "$"), ...(this.options.globalNames?.() ?? [])];
      throw new FxCompileError(`Undefined variable '${name}': it is not a declared input.${didYouMean(name, candidates)}`, node.src);
    } else {
      node.binding = { name, scope: ROOT, kind: "input", slot: -1 };
    }
    node.depth = 0;
  }

  private checkFn(fn: FnRef, src: SourceRef): void {
    if (!fn.def) {
      throw new FxCompileError(`Unknown function '${fn.name}'.${didYouMean(fn.name, this.registry.names())}`, src);
    }
    if (!fn.def.evaluate) { throw new FxCompileError(`Function '${fn.name}' has no evaluate implementation`, src); }
  }

  private checkArity(fn: FnRef, given: number, src: SourceRef): void {
    const def = fn.def;
    if (!def) { return; }
    if (def.intrinsic === "ifElse" && (given < 1 || given > 3)) {
      throw new FxCompileError(`'ifElse' takes 1 to 3 arguments, got ${given}`, src);
    }
    if ((def.intrinsic === "and" || def.intrinsic === "or") && given !== 2) {
      throw new FxCompileError(`'${fn.name}' takes 2 arguments, got ${given}`, src);
    }
    // Only warn: `params` is documentation-grade metadata and `evaluate.length` can't see optional parameters.
    if (def.params && given > def.params.length) {
      this.warnings.push({ message: `'${fn.name}' takes at most ${def.params.length} argument(s), got ${given}`, sourceRef: src });
    }
  }

  // ---- traversal ----------------------------------------------------------------------------------------------

  private visitAll(nodes: readonly Node[], scope: ScopeInfo | undefined): void {
    for (const n of nodes) { this.visit(n, scope); }
  }

  private visit(node: Node, scope: ScopeInfo | undefined): void {
    switch (node.kind) {
      case "literal":
        if (node.bareWord) {
          if (this.options.strictIdentifiers) {
            const word = String(node.value);
            throw new FxCompileError(`Unknown identifier '${word}': quote it to use it as a string.${didYouMean(word, this.registry.names())}`, node.src);
          }
          this.bareWords.push({ word: String(node.value), sourceRef: node.src });
        }
        return;
      case "ref": this.resolveRef(node, scope); return;
      case "array": this.visitAll(node.items, scope); return;
      case "object": this.visitObject(node, scope); return;
      case "lambda": {
        const inner = this.paramScope("lambda", node.params, scope, node.src);
        if (inner) { node.scope = inner; }
        this.visit(node.body, inner ?? scope);
        return;
      }
      case "call":
        this.checkFn(node.fn, node.src);
        this.checkArity(node.fn, node.args.length, node.src);
        this.visitAll(node.args, scope);
        return;
      case "lazyCall":
        this.checkFn(node.fn, node.src);
        this.checkArity(node.fn, node.args.length, node.src);
        this.visitAll(node.args, scope);
        return;
      case "apply": this.visit(node.callee, scope); this.visitAll(node.args, scope); return;
      case "chain":
        this.visit(node.base, scope);
        for (const step of node.steps) { this.visitStep(step, scope); }
        return;
      case "unary": this.visit(node.operand, scope); return;
      case "binary": case "logical": this.visit(node.left, scope); this.visit(node.right, scope); return;
      case "cond": this.visit(node.test, scope); this.visit(node.then, scope); this.visit(node.else, scope); return;
    }
  }

  private visitStep(step: Step, scope: ScopeInfo | undefined): void {
    switch (step.kind) {
      case "prop": return;
      case "index": case "pick": this.visitAll(step.keys, scope); return;
      case "invoke":
        this.checkFn(step.fn, step.src);
        this.checkArity(step.fn, step.args.length + 1, step.src);
        this.visitAll(step.args, scope);
        return;
      case "invokeUser": this.visit(step.callee, scope); this.visitAll(step.args, scope); return;
    }
  }

  private visitObject(node: ObjectNode, outer: ScopeInfo | undefined): void {
    let scope = outer;
    if (node.decls.length) {
      const own = this.newScope("object", outer);
      for (const d of node.decls) { this.declare(own, d.name, d.kind === "var" ? "var" : "fn", d.src); }
      node.scope = own;
      scope = own;
    }

    for (const d of node.decls) {
      if (d.kind === "var") {
        this.visit(d.value, scope);
      } else {
        const inner = this.paramScope("lambda", d.params, scope, d.src);
        if (inner) { d.scope = inner; }
        this.visit(d.body, inner ?? scope);
      }
    }
    for (const f of node.fields) {
      if (f.kind === "static") {
        this.visit(f.value, scope);
      } else {
        this.visit(f.source, scope);
        const names: Param[] = [];
        if (f.valueName !== undefined) { names.push({ name: f.valueName, callable: false }); }
        if (f.keyName !== undefined) { names.push({ name: f.keyName, callable: false }); }
        const inner = this.paramScope("dynamic", names, scope, f.src);
        if (inner) { f.scope = inner; }
        this.visit(f.value, inner ?? scope);
      }
    }
    if (node.output) { this.visit(node.output, scope); }

    if (node.scope) { this.checkVarCycles(node.decls, node.scope); }
  }

  // ---- variable cycles (B11) ----------------------------------------------------------------------------------

  private checkVarCycles(decls: readonly Decl[], scope: ScopeInfo): void {
    const deps = new Map<number, Set<number>>();
    decls.forEach((d, slot) => {
      if (d.kind === "var") {
        const out = new Set<number>();
        collectVarRefs(d.value, scope, out);
        deps.set(slot, out);
      }
    });

    const state = new Map<number, "visiting" | "done">();
    const path: number[] = [];
    const visit = (slot: number): void => {
      if (state.get(slot) === "done") { return; }
      if (state.get(slot) === "visiting") {
        const cycle = [...path.slice(path.indexOf(slot)), slot].map(s => (decls[s] as Decl).name);
        throw new FxCompileError(`Cyclic variable dependency: ${cycle.join(" → ")}`, (decls[slot] as Decl).src);
      }
      state.set(slot, "visiting");
      path.push(slot);
      for (const dep of deps.get(slot) ?? []) { visit(dep); }
      path.pop();
      state.set(slot, "done");
    };
    for (const slot of deps.keys()) { visit(slot); }
  }
}

/**
 * Variables of `scope` that evaluating `node` reads directly. Lambda and function bodies are skipped (they run later,
 * so a cycle through them is recursion, which is allowed), and so are variables declared inside nested objects (they
 * are lazy). What this misses is caught at run time by the in-progress check of the backends.
 */
function collectVarRefs(node: Node, scope: ScopeInfo, out: Set<number>): void {
  const all = (nodes: readonly Node[]): void => nodes.forEach(n => collectVarRefs(n, scope, out));
  switch (node.kind) {
    case "literal": return;
    case "ref":
      if (node.binding && node.binding.scope === scope && node.binding.kind === "var") { out.add(node.binding.slot); }
      return;
    case "array": all(node.items); return;
    case "object":
      for (const f of node.fields) {
        if (f.kind === "static") { collectVarRefs(f.value, scope, out); } else { collectVarRefs(f.source, scope, out); collectVarRefs(f.value, scope, out); }
      }
      if (node.output) { collectVarRefs(node.output, scope, out); }
      return;
    case "lambda": return;
    case "call": case "lazyCall": all(node.args); return;
    case "apply": collectVarRefs(node.callee, scope, out); all(node.args); return;
    case "chain":
      collectVarRefs(node.base, scope, out);
      for (const s of node.steps) {
        if (s.kind === "index" || s.kind === "pick") { all(s.keys); }
        else if (s.kind === "invoke") { all(s.args); }
        else if (s.kind === "invokeUser") { collectVarRefs(s.callee, scope, out); all(s.args); }
      }
      return;
    case "unary": collectVarRefs(node.operand, scope, out); return;
    case "binary": case "logical": collectVarRefs(node.left, scope, out); collectVarRefs(node.right, scope, out); return;
    case "cond": collectVarRefs(node.test, scope, out); collectVarRefs(node.then, scope, out); collectVarRefs(node.else, scope, out); return;
  }
}
