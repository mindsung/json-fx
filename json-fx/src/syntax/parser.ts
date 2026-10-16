import type { FunctionRegistry } from "../api/registry";
import type { FxFunctionDef, SourceRef } from "../api/types";
import { FxCompileError, FxSyntaxError } from "../errors";
import type { Node, Param, Step, OpRef, FnRef } from "./ast";
import { buildObject, type ObjectEntry } from "./object-builder";
import { Scanner, type Token } from "./scanner";

// Binding powers. Lambda is a prefix form (lowest); conditional and comprehension are the loosest infix forms.
const BP_COND = 2;
const BP_COMP = 3;
/** Operators keep v0's numeric precedence scale: `||` 1 → 20, `==` 2 → 30, `+` 3 → 40, `*` 3.1 → 41, `**` 3.2 → 42. */
const opBindingPower = (precedence: number): number => Math.max(BP_COMP + 1, 10 + precedence * 10);
const RIGHT_ASSOC_EPSILON = 0.001;

/** A construct whose meaning differs from v0 and that only the parser can see (V1-PLAN.md §7.1); `json-fx check` reports these. */
export interface ParseNote {
  readonly rule: "B5" | "B18" | "C1";
  readonly message: string;
  readonly src: SourceRef;
}

export type ParseNoteSink = (note: ParseNote) => void;

export interface DynamicKey {
  readonly source: Node;
  readonly valueName?: string;
  readonly keyName?: string;
}

export interface FnDecl {
  readonly name: string;
  readonly params: Param[];
}

/**
 * Pratt parser for expression strings (V1-PLAN.md §5.3). Builds typed AST nodes directly; registered functions and
 * operators come from the registry. Unknown names in call position are *not* an error here (the resolver reports them,
 * with suggestions), so a template can always be parsed without every function being registered.
 */
export class Parser {
  private readonly scanner: Scanner;

  constructor(private readonly registry: FunctionRegistry, private readonly sink?: ParseNoteSink) {
    this.scanner = new Scanner(registry.operatorSymbols());
  }

  /** A complete expression. */
  public parseExpression(text: string, path = ""): Node {
    const p = new ExprParser(this.registry, this.scanner.scan(text, path), path, this.sink);
    const node = p.parseExpr(0);
    p.expectEof();
    return node;
  }

  /** Key `$name`. */
  public parseVarKey(text: string, path = ""): string {
    const p = new ExprParser(this.registry, this.scanner.scan(text, path), path, this.sink);
    const t = p.expectKind("var", "a variable name like '$name'");
    p.expectEof();
    return t.text;
  }

  /** Key `@name` or `@name(p1, $p2, @f)`. */
  public parseFnKey(text: string, path = ""): FnDecl {
    const p = new ExprParser(this.registry, this.scanner.scan(text, path), path, this.sink);
    const decl = p.parseFnDecl();
    p.expectEof();
    return decl;
  }

  /** The inside of a dynamic key `{ source [as $v[, $k]] }`. */
  public parseDynamicKey(text: string, path = ""): DynamicKey {
    const p = new ExprParser(this.registry, this.scanner.scan(text, path), path, this.sink);
    const key = p.parseDynamicKeyBody();
    p.expectEof();
    return key;
  }
}

class ExprParser {
  private i = 0;
  /** Number of postfix steps of the chain `parseChain` returned last (0 for a plain primary). */
  private lastChainSteps = 0;
  /** The primary `parsePrimary` returned last was a parenthesized expression containing a `?` guard. */
  private lastPrimaryGuarded = false;
  private guards = 0;
  private parenGuarded = false;

  constructor(
    private readonly registry: FunctionRegistry,
    private readonly tokens: Token[],
    private readonly path: string,
    private readonly sink?: ParseNoteSink
  ) {}

  // ---- token helpers ------------------------------------------------------------------------------------------

  private get tok(): Token { return this.tokens[this.i] as Token; }
  private peekAt(offset: number): Token { return (this.tokens[Math.min(this.i + offset, this.tokens.length - 1)]) as Token; }
  private next(): Token { const t = this.tok; if (t.kind !== "eof") { this.i++; } return t; }

  private ref(t: Token): SourceRef { return { path: this.path, line: t.line, column: t.column, symbol: t.text }; }

  private describe(t: Token): string { return t.kind === "eof" ? "end of expression" : `'${t.text}'`; }

  private fail(message: string, t: Token = this.tok): never {
    throw new FxSyntaxError(message, this.ref(t));
  }

  private unexpected(t: Token = this.tok, expected?: string): never {
    if (t.kind === "kw" && t.text === "as") { this.fail("'as' is only valid within a dynamic key declaration", t); }
    if (t.kind === "punct" && t.text === ",") {
      this.fail("Unexpected ','. A comma-separated list is only valid in arguments, parameters, array literals and indexers", t);
    }
    this.fail(`Unexpected ${this.describe(t)}${expected ? `, expected ${expected}` : ""}`, t);
  }

  private is(kind: Token["kind"], text?: string): boolean {
    const t = this.tok;
    return t.kind === kind && (text === undefined || t.text === text);
  }

  private accept(kind: Token["kind"], text: string): Token | undefined {
    return this.is(kind, text) ? this.next() : undefined;
  }

  private expect(kind: Token["kind"], text: string): Token {
    if (!this.is(kind, text)) { this.unexpected(this.tok, `'${text}'`); }
    return this.next();
  }

  public expectKind(kind: Token["kind"], what: string): Token {
    if (this.tok.kind !== kind) { this.unexpected(this.tok, what); }
    return this.next();
  }

  public expectEof(): void {
    if (this.tok.kind !== "eof") { this.unexpected(); }
  }

  // ---- expressions --------------------------------------------------------------------------------------------

  public parseExpr(rbp: number): Node {
    let left = this.parsePrefix();
    for (;;) {
      const t = this.tok;
      const bp = this.infixBindingPower(t);
      if (bp <= rbp) { break; }
      left = this.parseInfix(left, t, bp);
    }
    return left;
  }

  /** Whether tokens `from` … `to - 1` are one parenthesized group. */
  private parenthesized(from: number, to: number): boolean {
    let depth = 0;
    for (let k = from; k < to; k++) {
      const t = this.tokens[k] as Token;
      if (t.kind === "punct" && t.text === "(") { depth++; }
      else if (t.kind === "punct" && t.text === ")") { depth--; }
      if (depth === 0) { return k === to - 1 && k > from; }
    }
    return false;
  }

  private infixBindingPower(t: Token): number {
    if (t.kind === "kw") { return t.text === "if" ? BP_COND : t.text === "for" ? BP_COMP : -1; }
    if (t.kind === "op") {
      const op = this.registry.binaryOperator(t.text);
      if (op) { return opBindingPower(op.precedence); }
    }
    return -1;
  }

  private parseInfix(left: Node, t: Token, bp: number): Node {
    this.next();
    if (t.kind === "kw") {
      if (t.text === "if") {
        const test = this.parseExpr(BP_COND);
        this.expect("kw", "else");
        // Right-associative: the else branch may itself be a conditional.
        const elseStart = this.i;
        const otherwise = this.parseExpr(BP_COND - 1);
        if (this.sink && otherwise.kind === "cond" && !this.parenthesized(elseStart, this.i)) {
          this.sink({
            rule: "B18",
            message: "'A if C1 else B if C2 else D' groups as 'A if C1 else (B if C2 else D)' in v1; v0 grouped it as '(A if C1 else B) if C2 else D'. Add parentheses to keep the v0 reading",
            src: this.ref(t)
          });
        }
        return { kind: "cond", test, then: left, else: otherwise, src: this.ref(t) };
      }
      // `E for $x in A` → A:map($x => E)
      const v = this.expectKind("var", "a loop variable like '$x'");
      this.expect("kw", "in");
      const source = this.parseExpr(BP_COMP);
      const lambda: Node = { kind: "lambda", params: [{ name: v.text, callable: false }], body: left, src: this.ref(t) };
      return this.makeCall("map", [source, lambda], t);
    }

    const op = this.registry.binaryOperator(t.text) as NonNullable<ReturnType<FunctionRegistry["binaryOperator"]>>;
    const right = this.parseExpr(op.assoc === "right" ? bp - RIGHT_ASSOC_EPSILON : bp);
    const src = this.ref(t);
    if (op.def.intrinsic === "and" || op.def.intrinsic === "or") {
      return { kind: "logical", op: op.def.intrinsic === "and" ? "&&" : "||", left, right, src };
    }
    return { kind: "binary", op: { name: op.def.name, def: op.def, symbol: op.symbol }, left, right, src };
  }

  private parsePrefix(): Node {
    const t = this.tok;

    if (this.isLambdaStart()) { return this.parseLambda(); }

    if (t.kind === "op") {
      const op = this.registry.unaryOperator(t.text);
      if (op) {
        this.next();
        const operand = this.parsePrefixOperand();
        const ref: OpRef = { name: op.def.name, def: op.def, symbol: op.symbol };
        if (this.sink && this.lastChainSteps > 0) {
          this.sink({
            rule: "B5",
            message: `Prefix '${t.text}' applies to the whole chain here (v0 applied it to the base only); check the result is what the template meant`,
            src: this.ref(t)
          });
        }
        return { kind: "unary", op: ref, operand, src: this.ref(t) };
      }
    }
    return this.parseChain();
  }

  /** The operand of a prefix operator: another prefix operator or a chain (never a binary expression; V1-PLAN.md §4.3). */
  private parsePrefixOperand(): Node {
    const t = this.tok;
    if (t.kind === "op" && this.registry.unaryOperator(t.text)) {
      const nested = this.parsePrefix();
      this.lastChainSteps = 0; // the nested operator reported on its own
      return nested;
    }
    return this.parseChain();
  }

  private isLambdaStart(): boolean {
    const t = this.tok;
    if (t.kind === "var" || t.kind === "tpl") { return this.peekAt(1).kind === "punct" && this.peekAt(1).text === "=>"; }
    if (t.kind === "punct" && t.text === "(") {
      let k = 1;
      if (this.peekAt(k).text === ")" && this.peekAt(k).kind === "punct") { return this.peekAt(k + 1).text === "=>"; }
      for (;;) {
        const p = this.peekAt(k);
        if (p.kind !== "var" && p.kind !== "tpl") { return false; }
        const sep = this.peekAt(k + 1);
        if (sep.kind === "punct" && sep.text === ",") { k += 2; continue; }
        return sep.kind === "punct" && sep.text === ")" && this.peekAt(k + 2).kind === "punct" && this.peekAt(k + 2).text === "=>";
      }
    }
    return false;
  }

  private parseLambda(): Node {
    const start = this.tok;
    const params: Param[] = [];
    if (this.accept("punct", "(")) {
      while (!this.is("punct", ")")) {
        params.push(this.parseParam());
        if (!this.accept("punct", ",")) { break; }
      }
      this.expect("punct", ")");
    } else {
      params.push(this.parseParam());
    }
    this.expect("punct", "=>");
    const body = this.parseExpr(0);
    return { kind: "lambda", params, body, src: this.ref(start) };
  }

  private parseParam(): Param {
    const t = this.tok;
    if (t.kind !== "var" && t.kind !== "tpl") { this.unexpected(t, "a parameter like '$x' or '@f'"); }
    this.next();
    return { name: t.text, callable: t.kind === "tpl" };
  }

  // ---- chains -------------------------------------------------------------------------------------------------

  private parseChain(): Node {
    const base = this.parsePrimary();
    const guardedParens = this.lastPrimaryGuarded;
    let taken = 0;
    let node: Node = base;
    let steps: Step[] = [];
    const guarded: { param: string; receiver: Node; src: SourceRef }[] = [];
    const flush = (): Node => { this.lastChainSteps = taken; return steps.length ? { kind: "chain", base: node, steps, src: node.src } : node; };
    const took = (at: Token): void => {
      if (taken++ === 0 && guardedParens && this.sink) {
        this.sink({
          rule: "C1",
          message: "Parentheses end a '?' chain: if the parenthesized part is null, v0 short-circuited the steps after it, v1 throws",
          src: this.ref(at)
        });
      }
    };

    for (;;) {
      const t = this.tok;
      const guard = (t.kind === "op" && (t.text === "?." || t.text === "?:")) || (t.kind === "op" && (t.text === "?[" || t.text === "?{"));

      if (t.kind === "op" && (t.text === "." || t.text === "?.")) {
        this.next();
        took(t);
        steps.push({ kind: "prop", key: this.parsePropertyKey(), guard, src: this.ref(t) });
      } else if (t.kind === "op" && (t.text === ":" || t.text === "?:")) {
        this.next();
        took(t);
        const name = this.tok;
        if (name.kind === "ident") {
          this.next();
          const args = this.is("punct", "(") ? this.parseArgs() : [];
          const def = this.registry.get(name.text);
          if (def && (def.deferEvaluation || def.intrinsic)) {
            // Deferred-evaluation functions get the receiver as their first (lazy) argument: desugar to a call.
            const receiver = flush();
            if (guard) {
              // `R?:f(a)` is `null` when R is null or undefined, else `f(R, a)`, with R evaluated once and the rest of the
              // chain inside the guard. R is bound to a parameter (a name no template can spell) of an immediately applied
              // lambda: `(($g) => null if $g == null else f($g, a)…)(R)`; the wrapping happens when the chain ends.
              const param = `$%guard${++this.guards}`;
              const here = this.ref(t);
              const operand: Node = { kind: "ref", name: param, src: here };
              guarded.push({ param, receiver, src: here });
              node = this.makeCall(name.text, [operand, ...args], name);
            } else {
              node = this.makeCall(name.text, [receiver, ...args], name);
            }
            steps = [];
          } else {
            steps.push({ kind: "invoke", fn: { name: name.text, def }, args, guard, src: this.ref(name) });
          }
        } else if (name.kind === "tpl") {
          this.next();
          const args = this.is("punct", "(") ? this.parseArgs() : [];
          const callee: Node = { kind: "ref", name: name.text, src: this.ref(name) };
          steps.push({ kind: "invokeUser", callee, args, guard, src: this.ref(name) });
        } else {
          this.unexpected(name, "a function name after ':'");
        }
      } else if ((t.kind === "punct" && t.text === "[") || (t.kind === "op" && t.text === "?[")) {
        this.next();
        took(t);
        const keys = this.parseList("]");
        if (!keys.length) { this.fail("An indexer needs at least one index", t); }
        steps.push({ kind: "index", keys, multi: keys.length > 1, guard, src: this.ref(t) });
      } else if ((t.kind === "punct" && t.text === "{") || (t.kind === "op" && t.text === "?{")) {
        this.next();
        took(t);
        const keys = this.parsePickKeys();
        steps.push({ kind: "pick", keys, guard, src: this.ref(t) });
      } else {
        break;
      }
    }
    let result = flush();
    // Innermost guard last: each guard's receiver already contains the guards before it.
    for (let k = guarded.length - 1; k >= 0; k--) {
      const g = guarded[k] as (typeof guarded)[number];
      const isNull = this.makeCall("eq", [{ kind: "ref", name: g.param, src: g.src }, { kind: "literal", value: null, src: g.src }], this.tok);
      const body: Node = { kind: "cond", test: isNull, then: { kind: "literal", value: null, src: g.src }, else: result, src: g.src };
      const lambda: Node = { kind: "lambda", params: [{ name: g.param, callable: false }], body, src: g.src };
      result = { kind: "apply", callee: lambda, args: [g.receiver], src: g.src };
    }
    return result;
  }

  private parsePropertyKey(): string {
    const t = this.tok;
    switch (t.kind) {
      case "str": this.next(); return t.value as string;
      case "ident": case "kw": case "var": case "num": this.next(); return t.text;
      default: return this.unexpected(t, "a property name");
    }
  }

  /** `a, b` in `{a, b}`: a bare name is the key itself (never a function call), anything else is an expression. */
  private parsePickKeys(): Node[] {
    const keys: Node[] = [];
    for (;;) {
      const t = this.tok;
      const after = this.peekAt(1);
      const bare = (t.kind === "ident" || t.kind === "kw") && after.kind === "punct" && (after.text === "," || after.text === "}");
      if (bare) {
        this.next();
        keys.push({ kind: "literal", value: t.text, src: this.ref(t) });
      } else {
        keys.push(this.parseExpr(0));
      }
      if (!this.accept("punct", ",")) { break; }
    }
    this.expect("punct", "}");
    return keys;
  }

  /** Items up to and including the closing token; the opening token is already consumed. */
  private parseList(close: string): Node[] {
    const items: Node[] = [];
    if (this.accept("punct", close)) { return items; }
    for (;;) {
      items.push(this.parseExpr(0));
      if (!this.accept("punct", ",")) { break; }
    }
    this.expect("punct", close);
    return items;
  }

  private parseArgs(): Node[] {
    this.expect("punct", "(");
    return this.parseList(")");
  }

  // ---- primaries ----------------------------------------------------------------------------------------------

  private parsePrimary(): Node {
    const isParen = this.is("punct", "(");
    this.parenGuarded = false;
    const node = this.parsePrimaryNode();
    this.lastPrimaryGuarded = isParen && this.parenGuarded;
    return node;
  }

  private parsePrimaryNode(): Node {
    const t = this.tok;
    switch (t.kind) {
      case "num": this.next(); return { kind: "literal", value: t.value as number, src: this.ref(t) };
      case "str": this.next(); return { kind: "literal", value: t.value as string, src: this.ref(t) };
      case "kw": return this.parseKeyword(t);
      case "var": this.next(); return { kind: "ref", name: t.text, src: this.ref(t) };
      case "tpl": {
        this.next();
        const ref: Node = { kind: "ref", name: t.text, src: this.ref(t) };
        return this.is("punct", "(") ? { kind: "apply", callee: ref, args: this.parseArgs(), src: this.ref(t) } : ref;
      }
      case "ident": {
        this.next();
        if (this.is("punct", "(")) { return this.makeCall(t.text, this.parseArgs(), t); }
        if (this.registry.has(t.text)) { return this.makeCall(t.text, [], t); }
        return { kind: "literal", value: t.text, bareWord: true, src: this.ref(t) };
      }
      case "punct":
        if (t.text === "(") {
          const open = this.i;
          this.next();
          const inner = this.parseExpr(0);
          this.expect("punct", ")");
          this.parenGuarded = this.tokens.slice(open, this.i).some(k => k.kind === "op" && (k.text === "?." || k.text === "?:" || k.text === "?[" || k.text === "?{"));
          return inner;
        }
        if (t.text === "[") {
          this.next();
          return { kind: "array", items: this.parseList("]"), src: this.ref(t) };
        }
        if (t.text === "{") { return this.parseObjectLiteral(); }
        return this.unexpected(t, "an expression");
      default:
        return this.unexpected(t, "an expression");
    }
  }

  private parseKeyword(t: Token): Node {
    const src = this.ref(t);
    switch (t.text) {
      case "true": this.next(); return { kind: "literal", value: true, src };
      case "false": this.next(); return { kind: "literal", value: false, src };
      case "null": this.next(); return { kind: "literal", value: null, src };
      case "undefined": this.next(); return { kind: "literal", value: undefined, src };
      default: return this.unexpected(t, "an expression");
    }
  }

  /**
   * Builds a call of a registered function, lowering the built-ins that have dedicated nodes: `ifElse` → `cond`,
   * `and`/`or` → `logical` (so they short-circuit), and deferred-evaluation functions → `lazyCall`.
   */
  private makeCall(name: string, args: Node[], t: Token): Node {
    const def: FxFunctionDef | undefined = this.registry.get(name);
    const src = this.ref(t);
    const undef = (): Node => ({ kind: "literal", value: undefined, src });

    if (def?.intrinsic === "ifElse" && args.length >= 1 && args.length <= 3) {
      return { kind: "cond", test: args[0] as Node, then: args[1] ?? undef(), else: args[2] ?? undef(), src };
    }
    if ((def?.intrinsic === "and" || def?.intrinsic === "or") && args.length === 2) {
      return { kind: "logical", op: def.intrinsic === "and" ? "&&" : "||", left: args[0] as Node, right: args[1] as Node, src };
    }
    const fn: FnRef = { name, def };
    return def?.deferEvaluation ? { kind: "lazyCall", fn, args, src } : { kind: "call", fn, args, src };
  }

  // ---- object literals and declarations ----------------------------------------------------------------------

  private parseObjectLiteral(): Node {
    const open = this.expect("punct", "{");
    const entries: ObjectEntry[] = [];
    if (!this.accept("punct", "}")) {
      for (;;) {
        entries.push(this.parseObjectEntry());
        if (!this.accept("punct", ",")) { break; }
      }
      this.expect("punct", "}");
    }
    return buildObject(entries, this.ref(open));
  }

  private parseObjectEntry(): ObjectEntry {
    const t = this.tok;
    const src = this.ref(t);
    const colon = (): void => { this.expect("op", ":"); };

    switch (t.kind) {
      case "ident": case "kw": case "num": case "str": {
        this.next();
        colon();
        return { kind: "static", key: t.kind === "str" ? (t.value as string) : t.text, optional: false, value: this.parseExpr(0), src };
      }
      case "var": {
        this.next();
        colon();
        return { kind: "var", name: t.text, value: this.parseExpr(0), src };
      }
      case "tpl": {
        const decl = this.parseFnDecl();
        colon();
        return { kind: "fn", name: decl.name, params: decl.params, body: this.parseExpr(0), src };
      }
      case "punct":
        if (t.text === "(") {
          this.next();
          this.expect("punct", ")");
          colon();
          return { kind: "output", value: this.parseExpr(0), src };
        }
        if (t.text === "[") {
          this.next();
          const key = this.parseDynamicKeyBody();
          this.expect("punct", "]");
          colon();
          return { kind: "dynamic", ...key, value: this.parseExpr(0), src };
        }
        return this.unexpected(t, "an object key");
      default:
        return this.unexpected(t, "an object key");
    }
  }

  public parseFnDecl(): FnDecl {
    const t = this.expectKind("tpl", "a function name like '@name'");
    const params: Param[] = [];
    if (this.accept("punct", "(")) {
      while (!this.is("punct", ")")) {
        params.push(this.parseParam());
        if (!this.accept("punct", ",")) { break; }
      }
      this.expect("punct", ")");
    }
    return { name: t.text, params };
  }

  /** `source [as $v[, $k]]` */
  public parseDynamicKeyBody(): DynamicKey {
    const source = this.parseExpr(0);
    if (!this.accept("kw", "as")) { return { source }; }
    const valueName = this.expectKind("var", "a variable like '$v'").text;
    if (!this.accept("punct", ",")) { return { source, valueName }; }
    const keyName = this.expectKind("var", "a variable like '$k'").text;
    return { source, valueName, keyName };
  }
}
