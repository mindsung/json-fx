import { FxParser } from "./model/fx-parser";
import { isArray } from "../common";
import { FxTokenRule } from "./model/fx-token-rule";
import { FxToken } from "./model/fx-token";
import { Fx } from "../fx";

export class Tokenizer implements FxParser<string, FxToken[]> {
  private tokens: FxToken[];
  private nextChar: string;
  private isLiteralSequence: boolean;
  private sourceIndex: number;

  private get lastToken(): FxToken {
    return this.tokens[this.tokens.length - 1] || null;
  }

  public parse(expr: string): FxToken[] {
    this.initialize();

    for (this.nextChar of expr) {
      this.parseNextChar();
      this.sourceIndex++;
    }

    this.removeWhitespaceTokens();
    return this.tokens;
  }

  private initialize() {
    this.tokens = [{symbol: "", tag: "", index: 0}];
    this.isLiteralSequence = false;
    this.sourceIndex = 0;
    this.nextChar = "";
  }

  private parseNextChar() {
    if (this.isLiteralSequence) {
      this.mergeNextWithLast(null);
    } else {
      this.mergeBasedOnRule();
    }

    if (this.nextChar == Fx.StringLiteralSymbol) {
      this.toggleAsLiteralSequence();
    }
  }

  private removeWhitespaceTokens() {
    this.tokens = this.tokens.filter(token => token.tag != "space" && token.tag != "");
  }

  private mergeBasedOnRule() {
    const rule = this.getNextRule();

    if (this.canMergeNextWithLast(rule)) {
      this.mergeNextWithLast(rule);
    } else {
      this.tokens.push({
        symbol: this.nextChar,
        tag: rule.tag,
        index: this.sourceIndex
      });
    }
  }

  private getNextRule(): FxTokenRule {
    for (const rule of Fx.TokenRules) {
      if (rule.test && rule.test(this.nextChar)) {
        return Tokenizer.sanitizeRule(rule);
      }
    }
    return null;
  }

  private canMergeNextWithLast(rule: FxTokenRule): boolean {
    return !this.lastToken.tag
      || !rule.preventMerge && (rule.tag == this.lastToken.tag || rule.mergeWith.includes(this.lastToken.tag));
  }

  private mergeNextWithLast(rule: FxTokenRule) {
    this.lastToken.symbol += this.nextChar;

    if (!this.lastToken.tag) {
      this.lastToken.tag = rule.tag;
    }
  }

  private toggleAsLiteralSequence() {
    this.isLiteralSequence = !this.isLiteralSequence;
    this.lastToken.tag = "literal";
    this.lastToken.symbol = this.lastToken.symbol.replace(Fx.StringLiteralSymbol, "");
  }

  private static sanitizeRule(rule: FxTokenRule): FxTokenRule {
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
