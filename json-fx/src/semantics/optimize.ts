import type {
  Binding, ChainNode, Decl, Field, FnRef, LiteralNode, LiteralValue, Node, ObjectNode, OpRef, Step
} from "../syntax/ast";
import { referencedBindings } from "../syntax/walk";

/**
 * AST → AST optimizer (V1-PLAN.md §5.7), run between `resolve` and the backends. Three rewrites, none of which can
 * change what a template computes or which error it raises:
 *
 *  1. constant folding: a call/unary/binary of a `pure` function whose arguments are all literals is evaluated now,
 *     if it returns a primitive (never a mutable `Date`, array or object) and does not throw (then the error happens
 *     at run time, as it would have); `&&`, `||` and `A if C else B` with a literal condition pick their result;
 *  2. a variable bound to a literal is inlined at its references;
 *  3. declarations nothing reaches are removed (they are lazy, so they never ran).
 *
 * Each pass rebuilds the tree without resolver information, so `optimize` calls `resolve` on the result again before
 * the next pass (slots and frame depths change when declarations disappear) and stops when a pass changes nothing.
 * Variable inlining and removal chain (`$a: 2`, `$b: $a + 1`), hence the loop.
 */

/** A folded string longer than this stays a run-time computation (keeps generated source small). */
const MAX_FOLDED_STRING = 1024;
const MAX_PASSES = 8;

const isPrimitive = (v: unknown): v is LiteralValue =>
  v === null || v === undefined || typeof v === "boolean" || typeof v === "number" || (typeof v === "string" && v.length <= MAX_FOLDED_STRING);

/**
 * @param root     a resolved tree
 * @param resolve  resolves a freshly built tree in place (same options as the first resolution)
 * @returns a resolved tree: `root` itself when nothing could be optimized
 */
export function optimize(root: Node, resolve: (tree: Node) => void): Node {
  let tree = root;
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const rewriter = new Rewriter();
    const next = rewriter.node(tree, true);
    if (!rewriter.changed) { break; }
    resolve(next);
    tree = next;
  }
  return tree;
}

class Rewriter {
  public changed = false;
  /** Variables whose (rewritten) value is a literal. */
  private readonly constants = new Map<Binding, LiteralNode>();

  private literal(value: LiteralValue, from: Node): LiteralNode {
    this.changed = true;
    return { kind: "literal", value, src: from.src };
  }

  /**
   * `chosen` replaces `from`, a `&&`/`||`/`ifElse` whose condition is a literal. Errors are attributed by source
   * reference: native errors to the node at the root of a field, item, variable or function body (a "point"), `throw`
   * to its argument, "not a function" to the callee, while errors that carry their own reference (an undefined
   * variable) keep it. A literal can't fail, so it simply takes `from`'s reference. Any other node would change
   * what is reported when it stands at one of those positions (`point`), so there the node is left as it is.
   */
  private pick(chosen: Node, from: Node, point: boolean, keep: () => Node): Node {
    if (chosen.kind === "literal") { this.changed = true; return { ...chosen, src: from.src }; }
    if (point) { return keep(); }
    this.changed = true;
    return chosen;
  }

  private fold(def: FnRef["def"], args: readonly Node[], at: Node): Node | undefined {
    if (!def || !def.pure || def.deferEvaluation || !def.evaluate) { return undefined; }
    if (!args.every(a => a.kind === "literal")) { return undefined; }
    let result: unknown;
    try {
      result = def.evaluate(...args.map(a => (a as LiteralNode).value));
    } catch {
      return undefined;
    }
    return isPrimitive(result) ? this.literal(result, at) : undefined;
  }

  private op(op: OpRef, args: readonly Node[], at: Node): Node | undefined {
    return this.fold(op.def, args, at);
  }

  /** Rewrites nodes at positions where source references matter (see `pick`). */
  private points(nodes: readonly Node[]): Node[] {
    return nodes.map(n => this.node(n, true));
  }

  private nodes(nodes: readonly Node[]): Node[] {
    return nodes.map(n => this.node(n));
  }

  /** @param point  `node` is the root of a field, item, variable, function body or output, a lazy argument or a callee */
  public node(node: Node, point = false): Node {
    switch (node.kind) {
      case "literal": return node;
      case "ref": {
        const binding = node.binding;
        const constant = binding && binding.kind === "var" ? this.constants.get(binding) : undefined;
        if (constant) { return this.literal(constant.value, node); }
        return { kind: "ref", name: node.name, src: node.src };
      }
      case "array": return { kind: "array", items: this.points(node.items), src: node.src };
      case "object": return this.object(node);
      case "lambda": return { kind: "lambda", params: node.params, body: this.node(node.body), src: node.src };
      case "call": {
        const args = this.nodes(node.args);
        return this.fold(node.fn.def, args, node) ?? { kind: "call", fn: node.fn, args, src: node.src };
      }
      case "lazyCall": return { kind: "lazyCall", fn: node.fn, args: this.points(node.args), src: node.src };
      case "apply": return { kind: "apply", callee: this.node(node.callee, true), args: this.nodes(node.args), src: node.src };
      case "chain": return this.chain(node);
      case "unary": {
        const operand = this.node(node.operand);
        return this.op(node.op, [operand], node) ?? { kind: "unary", op: node.op, operand, src: node.src };
      }
      case "binary": {
        const left = this.node(node.left);
        const right = this.node(node.right);
        return this.op(node.op, [left, right], node) ?? { kind: "binary", op: node.op, left, right, src: node.src };
      }
      case "logical": {
        const left = this.node(node.left);
        const right = this.node(node.right);
        const keep = (): Node => ({ kind: "logical", op: node.op, left, right, src: node.src });
        if (left.kind === "literal") {
          return this.pick(node.op === "&&" ? (left.value ? right : left) : (left.value ? left : right), node, point, keep);
        }
        return keep();
      }
      case "cond": {
        const test = this.node(node.test);
        const then = this.node(node.then);
        const otherwise = this.node(node.else);
        const keep = (): Node => ({ kind: "cond", test, then, else: otherwise, src: node.src });
        if (test.kind === "literal") { return this.pick(test.value ? then : otherwise, node, point, keep); }
        return keep();
      }
    }
  }

  /** Folds the leading `:fn(...)` steps of a literal base (`'ab':toUpperCase()`), as `fold` does for calls. */
  private chain(node: ChainNode): Node {
    let base = this.node(node.base);
    const steps = node.steps.map(s => this.step(s));
    let done = 0;
    while (done < steps.length && base.kind === "literal" && base.value != null) {
      const step = steps[done] as Step;
      if (step.kind !== "invoke") { break; }
      const folded = this.fold(step.fn.def, [base, ...step.args], node);
      if (!folded) { break; }
      base = folded;
      done++;
    }
    return done === steps.length ? base : { kind: "chain", base, steps: steps.slice(done), src: node.src };
  }

  private step(step: Step): Step {
    switch (step.kind) {
      case "prop": return step;
      case "index": return { ...step, keys: this.nodes(step.keys) };
      case "pick": return { ...step, keys: this.nodes(step.keys) };
      case "invoke": return { ...step, args: this.nodes(step.args) };
      case "invokeUser": return { ...step, callee: this.node(step.callee, true), args: this.nodes(step.args) };
    }
  }

  private object(node: ObjectNode): Node {
    const scope = node.scope;
    // Declarations are rewritten in order, so a literal var is known to the ones after it (the rest chains in the
    // next pass).
    const decls: Decl[] = node.decls.map((d) => {
      if (d.kind === "var") {
        const value = this.node(d.value, true);
        const binding = scope?.bindings.get(d.name);
        if (value.kind === "literal" && binding) { this.constants.set(binding, value); }
        return { ...d, value };
      }
      return { kind: "fn", name: d.name, params: d.params, body: this.node(d.body, true), src: d.src };
    });
    const fields: Field[] = node.fields.map((f) => {
      if (f.kind === "static") { return { ...f, value: this.node(f.value, true) }; }
      const { scope: _scope, ...rest } = f;
      return { ...rest, source: this.node(f.source, true), value: this.node(f.value, true) };
    });
    const output = node.output ? this.node(node.output, true) : undefined;

    const live = scope ? reachableDecls(node) : undefined;
    const kept = live ? decls.filter((_d, i) => live.has(i)) : decls;
    if (kept.length !== decls.length) { this.changed = true; }

    return {
      kind: "object",
      decls: kept,
      fields,
      ...(output ? { output } : {}),
      src: node.src
    };
  }
}

/**
 * Indexes of the declarations of `object` that its fields or output reach, directly or through other live
 * declarations. Computed on the *original* (resolved) node: references to the object's own bindings can only occur
 * inside it. Conservative: references that this pass inlines still count, and are collected by the next pass.
 */
function reachableDecls(object: ObjectNode): Set<number> {
  const scope = object.scope!;
  const bySlot = new Map<Binding, number>();
  object.decls.forEach((d, i) => { const b = scope.bindings.get(d.name); if (b) { bySlot.set(b, i); } });

  const live = new Set<number>();
  const pending: Node[] = [];
  const seen = (node: Node): void => {
    for (const b of referencedBindings(node)) {
      const i = bySlot.get(b);
      if (i !== undefined && !live.has(i)) {
        live.add(i);
        const d = object.decls[i] as Decl;
        pending.push(d.kind === "var" ? d.value : d.body);
      }
    }
  };
  for (const f of object.fields) { seen(f.kind === "static" ? f.value : f.source); if (f.kind === "dynamic") { seen(f.value); } }
  if (object.output) { seen(object.output); }
  while (pending.length) { seen(pending.pop() as Node); }
  return live;
}
