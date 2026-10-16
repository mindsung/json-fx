import type { Binding, Node } from "./ast";

/** Direct child nodes of `node` (declaration bodies, field values and sources, chain step keys and arguments included). */
export function childNodes(node: Node): Node[] {
  switch (node.kind) {
    case "literal": case "ref": return [];
    case "array": return node.items;
    case "object": {
      const out: Node[] = [];
      for (const d of node.decls) { out.push(d.kind === "var" ? d.value : d.body); }
      for (const f of node.fields) { if (f.kind === "static") { out.push(f.value); } else { out.push(f.source, f.value); } }
      if (node.output) { out.push(node.output); }
      return out;
    }
    case "lambda": return [node.body];
    case "call": case "lazyCall": return node.args;
    case "apply": return [node.callee, ...node.args];
    case "chain": {
      const out: Node[] = [node.base];
      for (const s of node.steps) {
        if (s.kind === "index" || s.kind === "pick") { out.push(...s.keys); }
        else if (s.kind === "invoke") { out.push(...s.args); }
        else if (s.kind === "invokeUser") { out.push(s.callee, ...s.args); }
      }
      return out;
    }
    case "unary": return [node.operand];
    case "binary": case "logical": return [node.left, node.right];
    case "cond": return [node.test, node.then, node.else];
  }
}

/** Calls `visit` for `node` and every node below it, parents first. */
export function visitNodes(node: Node, visit: (node: Node) => void): void {
  const stack: Node[] = [node];
  while (stack.length) {
    const n = stack.pop() as Node;
    visit(n);
    const children = childNodes(n);
    for (let i = children.length - 1; i >= 0; i--) { stack.push(children[i] as Node); }
  }
}

/** Bindings of every resolved `ref` at or below `node`. */
export function referencedBindings(node: Node): Binding[] {
  const out: Binding[] = [];
  visitNodes(node, (n) => { if (n.kind === "ref" && n.binding) { out.push(n.binding); } });
  return out;
}
