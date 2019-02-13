import {PxParser} from "./px-parser";
import {PxNode} from "./px-node";

export class PxNodeParser implements PxParser<PxNode, void> {
    public parsers: PxParser<PxNode, void>[];

    constructor(...parsers: PxParser<PxNode, void>[]) {
        this.parsers = parsers;
    }

    evaluate(root: PxNode): void {
        for (const parser of this.parsers) {
            this.evaluateTree(root, parser);
        }
    }

    private evaluateTree(root: PxNode, parser: PxParser<PxNode, void>) {
        root.forEachChild(((index, node) => {
            this.evaluateTree(node, parser);
        }));

        parser.evaluate(root);
    }
}
