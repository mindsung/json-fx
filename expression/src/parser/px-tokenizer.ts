import {PxNode} from "./px-node";
import {PxParser} from "./px-parser";

export class PxTokenizer implements PxParser<string, PxNode[]> {
    private static classify(token: PxNode): void {
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
        } else if (/[\w$_]/i.test(c)) {
            token.addTags("identifier");
        } else if (!c || /\s/.test(c)) {
            token.addTags("space");
        } else {
            token.addTags("operator");
        }
    }

    private static canMergeTokens(lastToken: PxNode, nextToken: PxNode): boolean {
        return !lastToken.isTaggedAny()
            || lastToken.isTaggedAny(...nextToken.getTags()) && !lastToken.isTagged("group")
            || lastToken.isTaggedAny("expression", "parameter") && nextToken.isTagged("identifier")
            || lastToken.value === "$" && nextToken.value === "*"; // Special case for "$*"
    }

    private static mergeTokens(lastToken: PxNode, nextToken: PxNode) {
        lastToken.value += nextToken.value;
        if (!lastToken.isTaggedAny()) {
            lastToken.addTags(...nextToken.getTags());
        }
    }

    evaluate(expr: string): PxNode[] {
        const tokens: PxNode[] = [new PxNode()];
        let lastToken: PxNode = tokens[0];

        const split = (next: PxNode) => {
            lastToken = next;
            tokens.push(lastToken);
        };

        let isLiteral = false;

        for (let i = 0; i < expr.length; i++) {
            const nextToken = new PxNode(expr[i]);
            PxTokenizer.classify(nextToken);

            if (nextToken.isTagged("literal")) {
                isLiteral = !isLiteral;
                split(new PxNode());
            } else if (PxTokenizer.canMergeTokens(lastToken, nextToken) || isLiteral) {
                PxTokenizer.mergeTokens(lastToken, nextToken);
            } else {
                split(nextToken);
            }
        }

        return tokens.filter(el => el.isTaggedAny() && !el.isTagged("space"));
    }
}
