import {PxParser} from "./px-parser";
import {PxNode} from "./px-node";

export class PxGrouper implements PxParser<PxNode[], PxNode> {
    private static bracketsMatch(open: string, close: string) {
        return open === "(" && close === ")"
            || open === "[" && close === "]"
            || open === "{" && close === "}";
    }

    private static nest(root: PxNode, lastToken: PxNode, nextToken: PxNode) {
        if (lastToken.isTagged("expression")) {
            return lastToken;
        } else {
            root.addChild(nextToken);
            return nextToken;
        }
    }

    private static getTokenType(token: PxNode): "open" | "close" | "value" {
        if (token.isTagged("group")) {
            if (token.isTagged("close")) {
                return "close";
            } else {
                return "open";
            }
        } else {
            return "value";
        }
    }

    evaluate(tokens: PxNode[]): PxNode {
        const global = new PxNode("global", "global");
        let root = global;

        let lastToken: PxNode = null;
        const bracketStack: string[] = [];

        for (const child of tokens) {
            const type = PxGrouper.getTokenType(child);

            switch (type) {
                case "open":
                    root.addChild(child);
                    lastToken = null;
                    root = child;
                    break;
                case "close":
                    lastToken = root;
                    root = root.getParent();
                    break;
                case "value":
                    lastToken = root.addChild(child);
                    break;
            }
        }

        if (root !== global) {
            throw new Error(`Unclosed "${root.value}"`);
        }

        return global;
    }
}
