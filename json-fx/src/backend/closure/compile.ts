import type { FxLazyArg, SourceRef } from "../../api/types";
import { callable, cyclicReference, dynamicEntries, get, getBlocked, getDynamic, index, isBlockedKey, lazyArg, missing, pick, setOwn, toKey, wrap } from "../../runtime/helpers";
import type { Binding, CallNode, Decl, Field, LambdaNode, Node, ObjectNode, RefNode, ScopeInfo, Step } from "../../syntax/ast";

/**
 * The closure backend (V1-PLAN.md §5.9): compiles the resolved AST into nested JS closures. No `eval`, so it works under
 * a strict CSP. It is also the semantic reference the code generator is tested against.
 *
 * Every scope that owns a frame (see `ScopeInfo`) becomes a `Frame` at run time; a reference is a (depth, slot) pair
 * resolved by the resolver. Object variables and functions are lazy: their slot starts as UNSET, holds BUSY while the
 * value is being computed (a re-entrant read means a cycle the static check couldn't see) and the value afterwards.
 */

/** Per-run state shared by every frame of one evaluation. */
export interface RunContext {
  readonly inputs: Record<string, unknown>;
  readonly globals: ReadonlyMap<string, unknown>;
}

interface Frame {
  readonly s: any[];
  readonly p: Frame | undefined;
  readonly c: RunContext;
  /** Thunks of the declarations of an object frame, by slot. */
  readonly d: ReadonlyArray<Thunk> | undefined;
}

type Fn = (f: Frame) => any;
type Thunk = (f: Frame) => any;
type Callable = (...args: any[]) => any;

const UNSET = Symbol("unset");
const BUSY = Symbol("busy");
const NO_SLOTS: any[] = [];

export type RunFn = (ctx: RunContext) => any;

export function compileClosure(root: Node): RunFn {
  const body = compile(root);
  return (ctx) => {
    try {
      return body({ s: NO_SLOTS, p: undefined, c: ctx, d: undefined });
    } catch (e) {
      throw wrap(e, root.src);
    }
  };
}

function compile(node: Node): Fn {
  switch (node.kind) {
    case "literal": { const v = node.value; return () => v; }
    case "ref": return compileRef(node);
    case "array": return compileArray(node.items, node.src);
    case "object": return compileObject(node);
    case "lambda": return compileLambda(node);
    case "call": return compileCall(node);
    case "lazyCall": return compileLazyCall(node.fn.def!.evaluate!, node.args);
    case "apply": return compileApply(node.callee, node.args);
    case "chain": return compileChain(node.base, node.steps);
    case "unary": {
      const e = node.op.def!.evaluate!;
      const operand = compile(node.operand);
      return (f) => e(operand(f));
    }
    case "binary": {
      const e = node.op.def!.evaluate!;
      const l = compile(node.left);
      const r = compile(node.right);
      return (f) => e(l(f), r(f));
    }
    case "logical": {
      const l = compile(node.left);
      const r = compile(node.right);
      return node.op === "&&" ? (f) => l(f) && r(f) : (f) => l(f) || r(f);
    }
    case "cond": {
      const test = compile(node.test);
      const then = compile(node.then);
      const otherwise = compile(node.else);
      return (f) => (test(f) ? then(f) : otherwise(f));
    }
  }
}

// ---- references -----------------------------------------------------------------------------------------------

function frameAt(f: Frame, depth: number): Frame {
  let fr = f;
  for (let i = depth; i > 0; i--) { fr = fr.p as Frame; }
  return fr;
}

function readLazy(fr: Frame, slot: number, name: string): any {
  const v = fr.s[slot];
  if (v !== UNSET) {
    if (v === BUSY) { cyclicReference(name); }
    return v;
  }
  fr.s[slot] = BUSY;
  try {
    const result = (fr.d as ReadonlyArray<Thunk>)[slot]!(fr);
    fr.s[slot] = result;
    return result;
  } catch (e) {
    fr.s[slot] = UNSET;
    throw e;
  }
}

function compileRef(node: RefNode): Fn {
  const b = node.binding as Binding;
  const depth = node.depth as number;
  const slot = b.slot;
  const name = b.name;

  switch (b.kind) {
    case "input": {
      const src = node.src;
      return (f) => {
        const inputs = f.c.inputs;
        if (!(name in inputs)) { throw missing(name, src); }
        return inputs[name];
      };
    }
    case "global":
      return (f) => f.c.globals.get(name);
    case "param":
      if (depth === 0) { return (f) => f.s[slot]; }
      if (depth === 1) { return (f) => (f.p as Frame).s[slot]; }
      return (f) => frameAt(f, depth).s[slot];
    default:
      if (depth === 0) { return (f) => readLazy(f, slot, name); }
      if (depth === 1) { return (f) => readLazy(f.p as Frame, slot, name); }
      return (f) => readLazy(frameAt(f, depth), slot, name);
  }
}

// ---- functions and lambdas ------------------------------------------------------------------------------------

const norm = (a: unknown): unknown => (a === undefined ? null : a);

/** Builds the JS function a lambda or `@fn` declaration evaluates to. Arguments are normalized (`undefined` → `null`). */
function callableFactory(paramCount: number, scope: ScopeInfo | undefined, body: Fn): (f: Frame) => Callable {
  if (paramCount === 0 || !scope) { return (f) => () => body(f); }
  if (paramCount === 1) {
    return (f) => (a) => body({ s: [norm(a)], p: f, c: f.c, d: undefined });
  }
  if (paramCount === 2) {
    return (f) => (a, b) => body({ s: [norm(a), norm(b)], p: f, c: f.c, d: undefined });
  }
  return (f) => (...args) => {
    const s = new Array(paramCount);
    for (let i = 0; i < paramCount; i++) { s[i] = norm(args[i]); }
    return body({ s, p: f, c: f.c, d: undefined });
  };
}

function compileLambda(node: LambdaNode): Fn {
  return callableFactory(node.params.length, node.scope, compile(node.body));
}

function declThunk(d: Decl): Thunk {
  if (d.kind === "var") {
    const value = compile(d.value);
    const src = d.value.src;
    return (fr) => {
      try { return value(fr); } catch (e) { throw wrap(e, src); }
    };
  }
  const body = compile(d.body);
  const src = d.body.src;
  const guarded: Fn = (fr) => {
    try { return body(fr); } catch (e) { throw wrap(e, src); }
  };
  return callableFactory(d.params.length, d.scope, guarded);
}

// ---- calls ------------------------------------------------------------------------------------------------------

function call(fn: Callable, args: Fn[]): Fn {
  const [a, b, c] = args;
  switch (args.length) {
    case 0: return () => fn();
    case 1: return (f) => fn((a as Fn)(f));
    case 2: return (f) => fn((a as Fn)(f), (b as Fn)(f));
    case 3: return (f) => fn((a as Fn)(f), (b as Fn)(f), (c as Fn)(f));
    default: return (f) => fn(...args.map(x => x(f)));
  }
}

function compileCall(node: CallNode): Fn {
  return call(node.fn.def!.evaluate as Callable, node.args.map(compile));
}

function compileLazyCall(fn: Callable, args: Node[]): Fn {
  const thunks = args.map(a => ({ run: compile(a), src: a.src }));
  return (f) => fn(...thunks.map((t): FxLazyArg => lazyArg(() => t.run(f), t.src)));
}

const calleeName = (callee: Node): string => (callee.kind === "ref" ? callee.name : "value");

function compileApply(calleeNode: Node, argNodes: Node[]): Fn {
  const callee = compile(calleeNode);
  const args = argNodes.map(compile);
  const [a, b] = args;
  const fnOf = (f: Frame): Callable => {
    return callable(callee(f), calleeName(calleeNode), calleeNode.src);
  };
  switch (args.length) {
    case 0: return (f) => fnOf(f)();
    case 1: return (f) => fnOf(f)((a as Fn)(f));
    case 2: return (f) => fnOf(f)((a as Fn)(f), (b as Fn)(f));
    default: return (f) => fnOf(f)(...args.map(x => x(f)));
  }
}

// ---- arrays and objects -----------------------------------------------------------------------------------------

function compileArray(items: Node[], _src: SourceRef): Fn {
  const fns = items.map(compile);
  const srcs = items.map(i => i.src);
  const n = fns.length;
  return (f) => {
    const out = new Array(n);
    for (let i = 0; i < n; i++) {
      try { out[i] = (fns[i] as Fn)(f); } catch (e) { throw wrap(e, srcs[i] as SourceRef); }
    }
    return out;
  };
}

type Emitter = (res: Record<string, unknown>, f: Frame) => void;

function compileField(field: Field): Emitter {
  const src = field.value.src;
  if (field.kind === "static") {
    const value = compile(field.value);
    const key = field.key;
    const optional = field.optional;
    return (res, f) => {
      let v: unknown;
      try { v = value(f); } catch (e) { throw wrap(e, src); }
      if (optional && v == null) { return; }
      setOwn(res, key, v);
    };
  }

  const source = compile(field.source);
  const value = compile(field.value);
  const scope = field.scope;
  const slots = scope ? scope.slots : 0;
  return (res, f) => {
    let entries;
    try { entries = dynamicEntries(source(f)); } catch (e) { throw wrap(e, field.source.src); }
    for (const entry of entries) {
      const fr: Frame = scope ? { s: slots === 1 ? [entry.value] : [entry.value, entry.index], p: f, c: f.c, d: undefined } : f;
      let v: unknown;
      try { v = value(fr); } catch (e) { throw wrap(e, src); }
      setOwn(res, entry.key, v);
    }
  };
}

function compileObject(node: ObjectNode): Fn {
  const scope = node.scope;
  const thunks = node.decls.map(declThunk);
  const emitters = node.fields.map(compileField);
  const output = node.output ? compile(node.output) : undefined;
  const slots = scope ? scope.slots : 0;
  const n = emitters.length;

  const frameOf = (f: Frame): Frame => {
    if (!scope) { return f; }
    const s = new Array(slots);
    for (let i = 0; i < slots; i++) { s[i] = UNSET; }
    return { s, p: f, c: f.c, d: thunks };
  };

  if (output) {
    const outSrc = (node.output as Node).src;
    return (f) => {
      try { return output(frameOf(f)); } catch (e) { throw wrap(e, outSrc); }
    };
  }
  return (f) => {
    const fr = frameOf(f);
    const res: Record<string, unknown> = {};
    for (let i = 0; i < n; i++) { (emitters[i] as Emitter)(res, fr); }
    return res;
  };
}

// ---- chains -----------------------------------------------------------------------------------------------------

interface StepFn {
  readonly guard: boolean;
  readonly exec: (v: any, f: Frame) => any;
}

function compileStep(step: Step): StepFn {
  switch (step.kind) {
    case "prop": {
      const key = step.key;
      return { guard: step.guard, exec: isBlockedKey(key) ? (v) => getBlocked(v, key) : (v) => get(v, key) };
    }
    case "index": {
      const keys = step.keys.map(compile);
      if (step.multi) {
        return { guard: step.guard, exec: (v, f) => index(v, keys.map(k => k(f))) };
      }
      const only = step.keys[0] as Node;
      if (only.kind === "literal") {
        const key = toKey(only.value);
        return { guard: step.guard, exec: typeof key === "string" && isBlockedKey(key) ? (v) => getBlocked(v, key) : (v) => get(v, key) };
      }
      const k = keys[0] as Fn;
      return { guard: step.guard, exec: (v, f) => getDynamic(v, k(f)) };
    }
    case "pick": {
      const keys = step.keys.map(compile);
      return { guard: step.guard, exec: (v, f) => pick(v, keys.map(k => k(f))) };
    }
    case "invoke": {
      const fn = step.fn.def!.evaluate as Callable;
      const args = step.args.map(compile);
      switch (args.length) {
        case 0: return { guard: step.guard, exec: (v) => fn(v) };
        case 1: { const a = args[0] as Fn; return { guard: step.guard, exec: (v, f) => fn(v, a(f)) }; }
        case 2: { const a = args[0] as Fn; const b = args[1] as Fn; return { guard: step.guard, exec: (v, f) => fn(v, a(f), b(f)) }; }
        default: return { guard: step.guard, exec: (v, f) => fn(v, ...args.map(a => a(f))) };
      }
    }
    case "invokeUser": {
      const callee = compile(step.callee);
      const args = step.args.map(compile);
      const guard = step.guard;
      const fnOf = (f: Frame): Callable => {
        return callable(callee(f), calleeName(step.callee), step.callee.src);
      };
      switch (args.length) {
        case 0: return { guard, exec: (v, f) => fnOf(f)(v) };
        case 1: { const a = args[0] as Fn; return { guard, exec: (v, f) => fnOf(f)(v, a(f)) }; }
        default: return { guard, exec: (v, f) => fnOf(f)(v, ...args.map(a => a(f))) };
      }
    }
  }
}

function compileChain(baseNode: Node, stepNodes: Step[]): Fn {
  const base = compile(baseNode);
  const steps = stepNodes.map(compileStep);
  const n = steps.length;

  if (n === 1) {
    const only = steps[0] as StepFn;
    const { guard, exec } = only;
    return guard
      ? (f) => { const v = base(f); return v == null ? null : exec(v, f); }
      : (f) => exec(base(f), f);
  }
  return (f) => {
    let v = base(f);
    for (let i = 0; i < n; i++) {
      const s = steps[i] as StepFn;
      if (s.guard && v == null) { return null; }
      v = s.exec(v, f);
    }
    return v;
  };
}
