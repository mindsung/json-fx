import type { FxFunctionDef } from "./types";

export interface BinaryOperator {
  readonly symbol: string;
  readonly def: FxFunctionDef;
  readonly precedence: number;
  readonly assoc: "left" | "right";
}

export interface UnaryOperator {
  readonly symbol: string;
  readonly def: FxFunctionDef;
}

/** Symbols the scanner and parser own; extensions can't redefine them. */
const RESERVED_SYMBOLS = new Set(["(", ")", "[", "]", "{", "}", ",", "=>", ".", "?.", ":", "?:", "?[", "?{", "?"]);

const KEYWORDS = new Set(["true", "false", "null", "undefined", "if", "else", "for", "in", "as"]);

/**
 * The set of functions and operators a template is parsed and resolved against. The scanner takes its operator
 * symbols from here (maximal munch), so extension operators need no scanner changes.
 */
export class FunctionRegistry {
  private readonly functions = new Map<string, FxFunctionDef>();
  private readonly binary = new Map<string, BinaryOperator>();
  private readonly unary = new Map<string, UnaryOperator>();

  constructor(defs: Iterable<FxFunctionDef> = []) {
    for (const def of defs) { this.define(def); }
  }

  /** Adds or replaces a definition (by name). Replacing drops the old definition's operator, if the new one has none. */
  public define(def: FxFunctionDef): void {
    if (!def.name || !/^[A-Za-z_~][A-Za-z0-9_~]*$/.test(def.name)) {
      throw new Error(`Invalid function name "${def.name}"`);
    }
    if (KEYWORDS.has(def.name)) { throw new Error(`"${def.name}" is a keyword and can't be a function name`); }
    const op = def.operator;
    if (op) { this.validateOperator(def.name, op.symbol); }

    this.removeOperatorsOf(def.name);
    this.functions.set(def.name, def);
    if (op) {
      if (op.isUnary) {
        this.unary.set(op.symbol, { symbol: op.symbol, def });
      } else {
        this.binary.set(op.symbol, { symbol: op.symbol, def, precedence: op.precedence, assoc: op.assoc ?? "left" });
      }
    }
  }

  public get(name: string): FxFunctionDef | undefined {
    return this.functions.get(name);
  }

  public has(name: string): boolean {
    return this.functions.has(name);
  }

  public names(): string[] {
    return [...this.functions.keys()];
  }

  public binaryOperator(symbol: string): BinaryOperator | undefined {
    return this.binary.get(symbol);
  }

  public unaryOperator(symbol: string): UnaryOperator | undefined {
    return this.unary.get(symbol);
  }

  /** Every symbol the scanner may produce as an operator token (binary and unary, deduplicated). */
  public operatorSymbols(): string[] {
    return [...new Set([...this.binary.keys(), ...this.unary.keys()])];
  }

  public clone(): FunctionRegistry {
    return new FunctionRegistry(this.functions.values());
  }

  private removeOperatorsOf(name: string): void {
    for (const table of [this.binary, this.unary] as Array<Map<string, { def: FxFunctionDef }>>) {
      for (const [symbol, entry] of table) {
        if (entry.def.name === name) { table.delete(symbol); }
      }
    }
  }

  private validateOperator(name: string, symbol: string): void {
    // Symbol operators may not use quotes, sigils, identifier characters, brackets or commas; word operators are letters only.
    if (!/^[^\s'"$@A-Za-z0-9_~()[\]{},]+$/.test(symbol) && !/^[A-Za-z_]+$/.test(symbol)) {
      throw new Error(`Invalid operator symbol "${symbol}" for function "${name}"`);
    }
    if (RESERVED_SYMBOLS.has(symbol) || KEYWORDS.has(symbol)) {
      throw new Error(`Operator symbol "${symbol}" (function "${name}") is reserved by the language`);
    }
  }
}
