import { FxNode } from "./fx-node";
import { FxParser } from "./fx-parser";

export class FxTokenizer extends FxParser<string, FxNode[]> {
  constructor() {
    super(null);
  }

  private static classify(token: FxNode): void {
    const c = token.value;

    if (c === "." || /\d/.test(c)) {
      token.addTags("identifier", "numeric");
    } else if (c === ":") {
      token.addTags("expression");
    } else if (c === "@") {
      token.addTags("parameter");
    } else if (c === "`") {
      token.addTags("literal");
    } else if (/[\[({]/.test(c)) {
      token.addTags("group", "open");
    } else if (/[\])}]/.test(c)) {
      token.addTags("group", "close");
    } else if (c === ",") {
      token.addTags("delimiter");
    } else if (/[\w_$~]/i.test(c)) {
      token.addTags("identifier");
    } else if (!c || /\s/.test(c)) {
      token.addTags("space");
    } else {
      token.addTags("operator");
    }
  }

  private static canMergeTokens(lastToken: FxNode, nextToken: FxNode): boolean {
    return !lastToken.isTaggedAny()
      || lastToken.isTaggedAny(...nextToken.getTags()) && !lastToken.isTagged("group")
      || lastToken.isTaggedAny("expression", "parameter") && nextToken.isTagged("identifier")
      || lastToken.value === "$" && nextToken.value === "*"; // Special case for "$*"
  }

  private static mergeTokens(lastToken: FxNode, nextToken: FxNode) {
    lastToken.value += nextToken.value;
    if (!lastToken.isTaggedAny()) {
      lastToken.addTags(...nextToken.getTags());
    }
  }

  evaluate(expr: string): FxNode[] {
    const tokens: FxNode[] = [new FxNode()];
    let lastToken: FxNode = tokens[0];

    const split = (next: FxNode) => {
      if (lastToken.isTagged("parameter")) {
        lastToken.value = lastToken.value.substr(1);
      }

      lastToken = next;
      tokens.push(lastToken);
    };

    let isLiteral = false;

    for (let i = 0; i < expr.length; i++) {
      const nextToken = new FxNode(expr[i]);
      FxTokenizer.classify(nextToken);

      if (nextToken.isTagged("literal")) {
        isLiteral = !isLiteral;
        if (isLiteral) {
          split(new FxNode("", "literal"));
        } else {
          split(new FxNode());
        }
      } else if (FxTokenizer.canMergeTokens(lastToken, nextToken) || isLiteral) {
        FxTokenizer.mergeTokens(lastToken, nextToken);
      } else {
        split(nextToken);
      }
    }

    return tokens.filter(el => el.isTaggedAny() && !el.isTagged("space"));
  }
}
