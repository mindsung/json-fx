import type { Decl, Field, Node, Step } from "./ast";

const list = (nodes: readonly Node[]): string => nodes.map(printNode).join(", ");

function printStep(s: Step): string {
  const q = s.guard ? "?" : "";
  switch (s.kind) {
    case "prop": return `${q}.${/^[A-Za-z_]\w*$/.test(s.key) ? s.key : JSON.stringify(s.key)}`;
    case "index": return `${q}[${list(s.keys)}]${s.multi ? "*" : ""}`;
    case "pick": return `${q}{${list(s.keys)}}`;
    case "invoke": return `${q}:${s.fn.name}${s.args.length ? `(${list(s.args)})` : ""}`;
    case "invokeUser": return `${q}:${printNode(s.callee)}${s.args.length ? `(${list(s.args)})` : ""}`;
  }
}

function printDecl(d: Decl): string {
  return d.kind === "var" ? `${d.name}=${printNode(d.value)}` : `${d.name}(${d.params.map(p => p.name).join(",")})=${printNode(d.body)}`;
}

function printField(f: Field): string {
  return f.kind === "static"
    ? `${JSON.stringify(f.key)}${f.optional ? "?" : ""}=${printNode(f.value)}`
    : `[${printNode(f.source)}${f.valueName ? ` as ${f.valueName}${f.keyName ? `,${f.keyName}` : ""}` : ""}]=${printNode(f.value)}`;
}

/** Compact, unambiguous S-expression-like rendering of an AST. For tests, debugging and `json-fx check` output. */
export function printNode(n: Node): string {
  switch (n.kind) {
    case "literal": return n.bareWord ? `~${n.value}` : n.value === undefined ? "undefined" : JSON.stringify(n.value);
    case "ref": return n.name;
    case "array": return `[${list(n.items)}]`;
    case "object": {
      const parts = [...n.decls.map(printDecl), ...n.fields.map(printField), ...(n.output ? [`()=${printNode(n.output)}`] : [])];
      return `{${parts.join("; ")}}`;
    }
    case "lambda": return `(${n.params.map(p => p.name).join(",")} => ${printNode(n.body)})`;
    case "call": return `${n.fn.name}(${list(n.args)})`;
    case "lazyCall": return `${n.fn.name}!(${list(n.args)})`;
    case "apply": return `${printNode(n.callee)}(${list(n.args)})`;
    case "chain": return `chain(${printNode(n.base)} ${n.steps.map(printStep).join(" ")})`;
    case "unary": return `(${n.op.symbol}u ${printNode(n.operand)})`;
    case "binary": return `(${n.op.symbol} ${printNode(n.left)} ${printNode(n.right)})`;
    case "logical": return `(${n.op} ${printNode(n.left)} ${printNode(n.right)})`;
    case "cond": return `cond(${printNode(n.test)} ? ${printNode(n.then)} : ${printNode(n.else)})`;
  }
}
