import { describe, expect, it } from "vitest";
import { createRegistry } from "../stdlib";
import { FxCompileError, FxSyntaxError } from "../errors";
import { Parser } from "./parser";
import { printNode } from "./print";

const parser = new Parser(createRegistry());
const p = (src: string): string => printNode(parser.parseExpression(src));
const syntaxError = (src: string, match?: RegExp): void => {
  expect(() => parser.parseExpression(src), src).toThrow(FxSyntaxError);
  if (match) { expect(() => parser.parseExpression(src)).toThrow(match); }
};

describe("literals and primaries", () => {
  it("parses literals", () => {
    expect(p("1")).toBe("1");
    expect(p("1.5e2")).toBe("150");
    expect(p("'a b'")).toBe('"a b"');
    expect(p("true")).toBe("true");
    expect(p("null")).toBe("null");
    expect(p("undefined")).toBe("undefined");
  });

  it("parses variables, including a bare `$`", () => {
    expect(p("$")).toBe("$");
    expect(p("$order")).toBe("$order");
  });

  it("parses array literals", () => {
    expect(p("[]")).toBe("[]");
    expect(p("[1, 'a', [2]]")).toBe('[1, "a", [2]]');
    expect(p("['a','b']")).toBe('["a", "b"]'); // B6
  });

  it("turns an unregistered bare word into a string constant and a registered one into a zero-argument call", () => {
    expect(p("order")).toBe("~order");
    expect(p("math~PI")).toBe("math~PI()");
    expect(p("now")).toBe("now()");
    expect(p("ifElse($.x, yes, no)")).toBe("cond(chain($ .x) ? ~yes : ~no)");
  });

  it("parses registered function calls and leaves unknown names for the resolver", () => {
    expect(p("add(1, 2)")).toBe("add(1, 2)");
    const node = parser.parseExpression("lowercse($)");
    expect(node).toMatchObject({ kind: "call", fn: { name: "lowercse", def: undefined } });
  });

  it("parses @name references and applications", () => {
    expect(p("@f")).toBe("@f");
    expect(p("@f(1, $x)")).toBe("@f(1, $x)");
  });
});

describe("operators", () => {
  it("applies the v0 precedence scale", () => {
    expect(p("1 + 2 * 3")).toBe("(+ 1 (* 2 3))");
    expect(p("1 * 2 + 3")).toBe("(+ (* 1 2) 3)");
    expect(p("1 + 2 == 3 && 4 > 3 || 5")).toBe("(|| (&& (== (+ 1 2) 3) (> 4 3)) 5)");
    expect(p("2 * 3 ** 2")).toBe("(* 2 (** 3 2))");
  });

  it("is left-associative except `**`", () => {
    expect(p("10 - 4 - 3")).toBe("(- (- 10 4) 3)");
    expect(p("100 / 10 / 5")).toBe("(/ (/ 100 10) 5)");
    expect(p("2 ** 3 ** 2")).toBe("(** 2 (** 3 2))");
  });

  it("lowers && and || to short-circuiting logical nodes (B4)", () => {
    expect(parser.parseExpression("$ != null && $.x")).toMatchObject({ kind: "logical", op: "&&" });
    expect(parser.parseExpression("a || b")).toMatchObject({ kind: "logical", op: "||" });
    expect(parser.parseExpression("and(1, 2)")).toMatchObject({ kind: "logical", op: "&&" });
  });

  it("binds a prefix operator to the whole chain, not just the first term (B5)", () => {
    expect(p("-$.x")).toBe("(-u chain($ .x))");
    expect(p("!$.f")).toBe("(!u chain($ .f))");
    expect(p("!!$a:length")).toBe("(!!u chain($a :length))");
  });

  it("applies unary minus before `**` (matches v0: -2 ** 2 is 4)", () => {
    expect(p("-2 ** 2")).toBe("(** (-u 2) 2)");
  });

  it("distinguishes unary and binary minus by position", () => {
    expect(p("1 - -2")).toBe("(- 1 (-u 2))");
    expect(p("-$a - $b")).toBe("(- (-u $a) $b)");
  });

  it("accepts operators and strings without spaces (B6)", () => {
    expect(p("'a'+'b'")).toBe('(+ "a" "b")');
  });

  it("supports extension operators with their declared precedence and associativity", () => {
    const registry = createRegistry([
      { name: "approx", evaluate: (a: number, b: number) => a === b, operator: { symbol: "<>", precedence: 2 } },
      { name: "cat", evaluate: (a: any, b: any) => `${a}${b}`, operator: { symbol: "^", precedence: 3.05, assoc: "right" } },
      { name: "sqr", evaluate: (a: number) => a * a, operator: { symbol: "#", precedence: 0, isUnary: true } }
    ]);
    const pp = new Parser(registry);
    expect(printNode(pp.parseExpression("1 + 2 ^ 3 ^ 4 <> 5"))).toBe("(<> (+ 1 (^ 2 (^ 3 4))) 5)");
    expect(printNode(pp.parseExpression("#$a.b + 1"))).toBe("(+ (#u chain($a .b)) 1)");
  });
});

describe("chains", () => {
  it("parses property steps in every spelling", () => {
    expect(p("$.a.b")).toBe("chain($ .a .b)");
    expect(p("$.'my key'")).toBe('chain($ ."my key")');
    expect(p("$.$b")).toBe('chain($ ."$b")');
    expect(p("$a.0.1")).toBe('chain($a ."0" ."1")');
    expect(p("$.if.in")).toBe("chain($ .if .in)");
  });

  it("parses invocations with and without arguments", () => {
    expect(p("$x:f")).toBe("chain($x :f)");
    expect(p("$x:f(1, 2)")).toBe("chain($x :f(1, 2))");
    expect(p("$x:@g(1)")).toBe("chain($x :@g(1))");
    expect(p("1:add(2)")).toBe("chain(1 :add(2))");
  });

  it("parses index and pick steps", () => {
    expect(p("$a[0]")).toBe("chain($a [0])");
    expect(p("$a[0, 2]")).toBe("chain($a [0, 2]*)");
    expect(p("$o{a, c}")).toBe('chain($o {"a", "c"})');
    expect(p("$o{$k}")).toBe("chain($o {$k})");
    expect(p("$o{first}")).toBe('chain($o {"first"})'); // a registered function name is still just a key
  });

  it("parses guarded steps", () => {
    expect(p("$a?.b?:f?[0]?{x}")).toBe('chain($a ?.b ?:f ?[0] ?{"x"})');
  });

  it("ends a chain at parentheses", () => {
    expect(p("($a?.b).c")).toBe("chain(chain($a ?.b) .c)");
  });

  it("lowers deferred-evaluation and intrinsic functions used as :fn to calls", () => {
    expect(p("$a.b:catch('d')")).toBe('catch!(chain($a .b), "d")');
    expect(p("$c:ifElse(1, 2)")).toBe("cond($c ? 1 : 2)");
    expect(p("$a:catch('d').x")).toBe('chain(catch!($a, "d") .x)');
  });

  it("lowers `?:` on a deferred-evaluation function to a guard around the call (receiver evaluated once, rest of the chain inside)", () => {
    expect(p("$a?:catch('d')")).toBe('($%guard1 => cond(eq($%guard1, null) ? null : catch!($%guard1, "d")))($a)');
    expect(p("$c?:ifElse(1, 2).x")).toBe("($%guard1 => cond(eq($%guard1, null) ? null : chain(cond($%guard1 ? 1 : 2) .x)))($c)");
    expect(p("$c?:ifElse(1, 2)?:ifElse(3, 4)")).toBe(
      "($%guard1 => cond(eq($%guard1, null) ? null : ($%guard2 => cond(eq($%guard2, null) ? null : cond($%guard2 ? 3 : 4)))(cond($%guard1 ? 1 : 2))))($c)");
  });
});

describe("lambdas, conditionals and comprehensions", () => {
  it("parses the three lambda forms", () => {
    expect(p("$x => $x + 1")).toBe("($x => (+ $x 1))");
    expect(p("($a, $b) => $a")).toBe("($a,$b => $a)");
    expect(p("() => 1")).toBe("( => 1)");
    expect(p("@f => @f(1)")).toBe("(@f => @f(1))");
    expect(p("[1]:map($x => $x * 2)")).toBe("chain([1] :map(($x => (* $x 2))))");
    expect(p("[1]:reduce(($acc, $n) => $acc + $n, 0)")).toBe("chain([1] :reduce(($acc,$n => (+ $acc $n)), 0))");
  });

  it("parses a lone `$` as a lambda parameter", () => {
    expect(p("$ => $ ** 2")).toBe("($ => (** $ 2))");
  });

  it("parses the Python-style conditional", () => {
    expect(p("1 if $a else 2")).toBe("cond($a ? 1 : 2)");
  });

  it("associates `if … else if … else` to the right (B18)", () => {
    expect(p("'minor' if $a < 18 else 'senior' if $a >= 66 else 'adult'"))
      .toBe('cond((< $a 18) ? "minor" : cond((>= $a 66) ? "senior" : "adult"))');
  });

  it("lowers comprehensions to map", () => {
    expect(p("$x * 2 for $x in [1, 2, 3]")).toBe("map([1, 2, 3], ($x => (* $x 2)))");
  });

  it("gives comprehension higher precedence than the conditional", () => {
    expect(p("$x for $x in $a if $c else 0")).toBe("cond($c ? map($a, ($x => $x)) : 0)");
    expect(p("0 if $c else $x for $x in $a")).toBe("cond($c ? 0 : map($a, ($x => $x)))");
  });

  it("lowers ifElse(c, a, b) to the same node as the conditional", () => {
    expect(p("ifElse($c, 1, 2)")).toBe(p("1 if $c else 2"));
    expect(p("ifElse($c, 1)")).toBe("cond($c ? 1 : undefined)");
  });
});

describe("object literals", () => {
  it("parses every key form", () => {
    expect(p("{ x: 1, 'a b': 2, 3: 4 }")).toBe('{"x"=1; "a b"=2; "3"=4}');
    expect(p("{ $k: 1, @f($n): $n, (): $k }")).toBe("{$k=1; @f($n)=$n; ()=$k}");
    expect(p("{ [$keys as $k]: $k, [$o as $v, $i]: $v }")).toBe("{[$keys as $k]=$k; [$o as $v,$i]=$v}");
    expect(p("{}")).toBe("{}");
  });

  it("does not treat a key's ':' as an invocation (no :_kv hack)", () => {
    expect(p("{ first: $a:first }")).toBe('{"first"=chain($a :first)}');
  });

  it("rejects fields next to a `()` output", () => {
    expect(() => parser.parseExpression("{ (): 1, a: 2 }")).toThrow(FxCompileError);
  });
});

describe("syntax errors", () => {
  it("reports malformed input", () => {
    for (const src of ["10-", "(10 + 5)-", "(10", "(10]", "3 *", "[1, 2", "add(1, 2", "$.", "1 + * 2", "1 && ", "1 + 2)", "+", "'abc",
      "1 ?", "1 2", "$x:", "$x[]", "a b", "1 if 2", "$x for in $a", "{ a 1 }", "$x => "]) {
      syntaxError(src);
    }
  });

  it("rejects a parenthesized list", () => {
    syntaxError("(1, 2)", /list/);
  });

  it("rejects `as` outside a dynamic key", () => {
    syntaxError("1 as $x", /dynamic key/);
  });

  it("carries a source position and the path", () => {
    try {
      parser.parseExpression("1 +\n  * 2", "lines[0].total");
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(FxSyntaxError);
      expect((e as FxSyntaxError).sourceRef).toMatchObject({ path: "lines[0].total", line: 2, column: 3, symbol: "*" });
      expect((e as Error).message).toContain("line 2, column 3");
    }
  });
});

describe("declaration keys", () => {
  it("parses function declarations", () => {
    expect(parser.parseFnKey("@f")).toEqual({ name: "@f", params: [] });
    expect(parser.parseFnKey("@add($a, @g)")).toEqual({ name: "@add", params: [{ name: "$a", callable: false }, { name: "@g", callable: true }] });
    expect(parser.parseFnKey("@f()")).toEqual({ name: "@f", params: [] });
    expect(() => parser.parseFnKey("@f($a")).toThrow(FxSyntaxError);
  });

  it("parses dynamic keys", () => {
    const k = parser.parseDynamicKey(" ['A','B'] as $v, $i ");
    expect(printNode(k.source)).toBe('["A", "B"]');
    expect([k.valueName, k.keyName]).toEqual(["$v", "$i"]);
    expect(parser.parseDynamicKey("$x as $v")).toMatchObject({ valueName: "$v" });
    expect(parser.parseDynamicKey("$x").valueName).toBeUndefined();
    expect(() => parser.parseDynamicKey("$x as")).toThrow(FxSyntaxError);
  });

  it("parses variable keys", () => {
    expect(parser.parseVarKey("$a")).toBe("$a");
    expect(parser.parseVarKey("$")).toBe("$");
    expect(() => parser.parseVarKey("$a b")).toThrow(FxSyntaxError);
  });
});
