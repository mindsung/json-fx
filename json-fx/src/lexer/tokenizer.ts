import {FxParser} from "../model/fx-parser";
import {isArray} from "../common";
import {FxTokenRule} from "../model/fx-token-rule";
import {FxToken} from "../model/fx-token";
import {Fx} from "../fx";

export class Tokenizer implements FxParser<string, FxToken[]> {

  private tokens: FxToken[];
  private next: string;
  private isLiteralSequence: boolean;
  private sourceLine: number;
  private sourceIndex: number;
  private prevToken: FxToken;

  private initialize(): void {
    this.tokens = [{symbol: "", tag: "", index: 0}];
    this.isLiteralSequence = false;
    this.sourceLine = 1;
    this.sourceIndex = 0;
    this.next = "";
    this.prevToken = this.tokens[0];
  }

  public parse(expr: string): FxToken[] {
    this.initialize();

    for (this.next of expr) {
      this.parseNextChar();

      if (this.next === "\n") {
        this.sourceLine++;
        this.sourceIndex = 0;
      } else {
        this.sourceIndex++;
      }
    }

    this.removeWhitespace();
    return this.tokens;
  }

  private parseNextChar(): void {
    if (this.isLiteralSequence) {
      this.mergeNextWithLast(null);
    } else {
      this.mergeBasedOnRule();
    }

    this.prevToken = this.tokens[this.tokens.length - 1] || null;

    if (this.next == Fx.SymbolLiteral) {
      this.toggleLiteralSequence();
    }
  }

  private removeWhitespace(): void {
    this.tokens = this.tokens.filter(token => token.tag != "space" && token.tag != "");
  }

  private mergeBasedOnRule(): void {
    const rule = this.getNextRule();

    if (this.canMergeNextWithLast(rule)) {
      this.mergeNextWithLast(rule);
    } else {
      this.tokens.push({symbol: this.next, tag: rule.tag, line: this.sourceLine, index: this.sourceIndex});
    }
  }

  private getNextRule(): FxTokenRule {
    for (const rule of Fx.TokenRules) {
      if (rule.test && rule.test(this.next)) {
        return Tokenizer.sanitize(rule);
      }
    }
    return null;
  }

  private canMergeNextWithLast(rule: FxTokenRule): boolean {
    return !this.prevToken.tag
      || !rule.preventMerge && (rule.tag == this.prevToken.tag || rule.mergeWith.includes(this.prevToken.tag));
  }

  private mergeNextWithLast(rule: FxTokenRule): void {
    this.prevToken.symbol += this.next;

    if (!this.prevToken.tag) {
      this.prevToken.tag = rule.tag;
    }
  }

  private toggleLiteralSequence(): void {
    this.isLiteralSequence = !this.isLiteralSequence;
    this.prevToken.tag = "literal";
    this.prevToken.symbol = this.prevToken.symbol.replace(Fx.SymbolLiteral, "");
  }

  private static sanitize(rule: FxTokenRule): FxTokenRule {
    rule.tag = rule.tag || "";
    rule.preventMerge = !!rule.preventMerge;

    if (rule.mergeWith) {
      rule.mergeWith = isArray(rule.mergeWith) ? rule.mergeWith : [rule.mergeWith];
    } else {
      rule.mergeWith = [];
    }

    return rule;
  }
}
