import type { SourceRef } from "../api/types";
import { FxSyntaxError } from "../errors";

export type TokenKind = "num" | "str" | "ident" | "var" | "tpl" | "kw" | "punct" | "op" | "eof";

export interface Token {
  readonly kind: TokenKind;
  /** Source text (for `str`: the raw text including quotes). */
  readonly text: string;
  /** Decoded value of `num` and `str` tokens. */
  readonly value?: number | string;
  readonly line: number;
  readonly column: number;
  /** Offset of the first character. */
  readonly start: number;
  /** Offset just past the last character. */
  readonly end: number;
}

export const KEYWORDS: ReadonlySet<string> = new Set(["true", "false", "null", "undefined", "if", "else", "for", "in", "as"]);

/** Structural operators the parser handles itself; always part of the operator set. */
const STRUCTURAL_OPERATORS = [".", "?.", ":", "?:", "?[", "?{"];
const PUNCTUATION = new Set(["(", ")", "[", "]", "{", "}", ","]);

const isDigit = (c: string): boolean => c >= "0" && c <= "9";
const isIdentStart = (c: string): boolean => (c >= "A" && c <= "Z") || (c >= "a" && c <= "z") || c === "_" || c === "~";
const isIdentChar = (c: string): boolean => isIdentStart(c) || isDigit(c);

/**
 * Turns an expression string into tokens. Operators are matched by maximal munch over the symbol set it was built with
 * (the registered operators plus the structural ones), so quotes and brackets are never part of an operator (V1-PLAN.md §5.2).
 */
export class Scanner {
  private readonly symbols: string[];
  private readonly wordOperators: ReadonlySet<string>;

  constructor(operatorSymbols: readonly string[]) {
    const all = new Set([...operatorSymbols, ...STRUCTURAL_OPERATORS]);
    this.wordOperators = new Set([...all].filter(s => /^[A-Za-z_]+$/.test(s)));
    this.symbols = [...all].filter(s => !this.wordOperators.has(s)).sort((a, b) => b.length - a.length);
  }

  public scan(src: string, path = ""): Token[] {
    const tokens: Token[] = [];
    let pos = 0;
    let line = 1;
    let lineStart = 0;

    const ref = (at: number, symbol: string): SourceRef => ({ path, line, column: at - lineStart + 1, symbol });
    const fail = (message: string, at: number, symbol: string): never => { throw new FxSyntaxError(message, ref(at, symbol)); };

    while (pos < src.length) {
      const c = src.charAt(pos);

      if (c === "\n") { line++; pos++; lineStart = pos; continue; }
      if (/\s/.test(c)) { pos++; continue; }

      const start = pos;
      const column = pos - lineStart + 1;
      const startLine = line;
      const push = (kind: TokenKind, end: number, value?: number | string): void => {
        const token: Token = { kind, text: src.slice(start, end), line: startLine, column, start, end };
        tokens.push(value === undefined ? token : { ...token, value });
        pos = end;
      };

      if (c === "'") {
        let value = "";
        let i = pos + 1;
        let closed = false;
        while (i < src.length) {
          const ch = src.charAt(i);
          if (ch === "\\" && (src.charAt(i + 1) === "'" || src.charAt(i + 1) === "\\")) { value += src.charAt(i + 1); i += 2; continue; }
          if (ch === "'") { closed = true; i++; break; }
          if (ch === "\n") { line++; lineStart = i + 1; }
          value += ch;
          i++;
        }
        if (!closed) { fail("Unterminated string literal", start, src.slice(start, start + 20)); }
        push("str", i, value);
        continue;
      }

      const prev = tokens[tokens.length - 1];
      const afterDot = prev !== undefined && prev.kind === "op" && (prev.text === "." || prev.text === "?.");

      if (isDigit(c)) {
        // After `.`, digits are a property key (`$a.0.1` is `.0` then `.1`), never a decimal number.
        const m = (afterDot ? /^\d+/ : /^\d+(\.\d+)?([eE][+-]?\d+)?/).exec(src.slice(pos));
        push("num", pos + (m as RegExpExecArray)[0].length, Number((m as RegExpExecArray)[0]));
        continue;
      }

      if (c === "$" || c === "@") {
        let i = pos + 1;
        while (i < src.length && isIdentChar(src.charAt(i))) { i++; }
        push(c === "$" ? "var" : "tpl", i);
        continue;
      }

      if (isIdentStart(c)) {
        let i = pos + 1;
        while (i < src.length && isIdentChar(src.charAt(i))) { i++; }
        const text = src.slice(pos, i);
        push(this.wordOperators.has(text) && !afterDot ? "op" : KEYWORDS.has(text) ? "kw" : "ident", i);
        continue;
      }

      if (c === "=" && src.charAt(pos + 1) === ">") { push("punct", pos + 2); continue; }
      if (PUNCTUATION.has(c)) { push("punct", pos + 1); continue; }

      const symbol = this.symbols.find(s => src.startsWith(s, pos));
      if (symbol) { push("op", pos + symbol.length); continue; }

      fail(`Unexpected character '${c}'`, pos, c);
    }

    tokens.push({ kind: "eof", text: "", line, column: src.length - lineStart + 1, start: src.length, end: src.length });
    return tokens;
  }
}
