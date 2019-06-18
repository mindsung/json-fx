import { FxToken } from "./model/fx-token";
import { FxParser } from "./model/fx-parser";
import { JsonFx, FxTokenTag } from "../tokens";
import { isArray } from "../../common";

export interface FxTokenRule {
  tag: FxTokenTag;
  test?: (c: string) => boolean;
  preventMerge?: boolean;
  mergeWith?: string | string[];
}

export class FxTokenizer extends FxParser<string, FxToken[]> {
  private tokens: FxToken[];
  private nextChar: string;
  private isLiteralSequence: boolean;
  private sourceIndex: number;

  private get lastToken() {
    return this.tokens[this.tokens.length - 1] || null;
  }

  public evaluate(expr: string): FxToken[] {
    this.initialize();

    while (expr[this.sourceIndex]) {
      this.nextChar = expr[this.sourceIndex];
      this.evaluateNextCharacter();

      this.sourceIndex++;
    }

    this.removeWhitespaceTokens();
    return this.tokens;
  }

  private initialize() {
    this.tokens = [new FxToken("", 0)];
    this.isLiteralSequence = false;
    this.sourceIndex = 0;
    this.nextChar = "";
  }

  private evaluateNextCharacter() {
    if (this.isLiteralSequence) {
      this.mergeNextWithLast(null);
    } else {
      this.mergeBasedOnRule();
    }

    if (this.nextChar === JsonFx.token.literalSymbol) {
      this.toggleAsLiteralSequence();
    }
  }

  private removeWhitespaceTokens() {
    this.tokens = this.tokens.filter(token => !(token.tag === "space"));
  }

  private mergeBasedOnRule() {
    const rule = FxTokenizer.getTokenRuleFrom(this.nextChar);

    if (this.canMergeNextWithLast(rule)) {
      this.mergeNextWithLast(rule);
    } else {
      this.tokens.push(new FxToken(this.nextChar, this.sourceIndex, rule.tag));
    }
  }

  private static getTokenRuleFrom(c: string): FxTokenRule {
    for (const rule of JsonFx.token.rules) {
      if (rule.test && rule.test(c)) {
        return this.sanitizeRule(rule);
      }
    }

    return null;
  }

  private static sanitizeRule(rule) {
    return {
      tag: rule.tag || "",
      preventMerge: rule.preventMerge || false,
      mergeWith: rule.mergeWith ? isArray(rule.mergeWith) ? rule.mergeWith : [rule.mergeWith] : []
    };
  }

  private canMergeNextWithLast(rule: FxTokenRule): boolean {
    const mergeWith = isArray(rule.mergeWith) ? rule.mergeWith : [rule.mergeWith];
    return !this.lastToken.tag
      || !rule.preventMerge && (rule.tag === this.lastToken.tag || mergeWith.includes(this.lastToken.tag));
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
    this.lastToken.symbol = this.lastToken.symbol.replace("`", "");
  }
}
