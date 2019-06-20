import {FxParser} from "./model/fx-parser";
import {JsonFx} from "./index";
import {isArray} from "../../common";
import {FxTokenRule} from "./model/fx-token-rule";
import {FxToken} from "./model/fx-token";

export class FxTokenizer extends FxParser<string, FxToken[]> {
  private tokens: FxToken[];
  private nextChar: string;
  private isLiteralSequence: boolean;
  private sourceIndex: number;

  private get lastToken() {
    return this.tokens[this.tokens.length - 1] || null;
  }

  public parse(expr: string): FxToken[] {
    this.initialize();

    while (expr[this.sourceIndex]) {
      this.nextChar = expr[this.sourceIndex];
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

    if (this.nextChar == JsonFx.literalSymbol) {
      this.toggleAsLiteralSequence();
    }
  }

  private removeWhitespaceTokens() {
    this.tokens = this.tokens.filter(token => !(token.tag === "space"));
  }

  private mergeBasedOnRule() {
    const rule = this.getNextCharRule();

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

  private getNextCharRule(): FxTokenRule {
    for (const rule of JsonFx.tokenRules) {
      if (rule.test && rule.test(this.nextChar)) {
        return FxTokenizer.sanitizeRule(rule);
      }
    }
    return null;
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

  private canMergeNextWithLast(rule: FxTokenRule): boolean {
    return !this.lastToken.tag
      || !rule.preventMerge && (rule.tag === this.lastToken.tag || rule.mergeWith.includes(this.lastToken.tag));
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
