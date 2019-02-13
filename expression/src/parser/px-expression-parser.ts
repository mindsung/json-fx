import {PxNode} from "./px-node";
import {PxParser} from "./px-parser";

export class PxExpressionParser implements PxParser<PxNode, void> {
    private static nestParameters(root: PxNode, buffer: PxNode[]): PxNode {
        const paramGroup = new PxNode("@param", "parameter", "group");
        while (buffer.length > 0) {
            paramGroup.addChild(buffer.shift());
        }
        root.addChild(paramGroup);
        return paramGroup;
    }

    evaluate(root: PxNode): void {
        let lastNode: PxNode = null;
        const paramBuffer: PxNode[] = [];

        const isGroup = root.isTagged("group");

        root.forEachChild((index, node) => {
            if (node.isTagged("group", "open") && lastNode.isTagged("expression")) {
                node.transferChildren(lastNode);
                node.orphan();
                paramBuffer.push(lastNode);
            } else if (isGroup && node.isTagged("delimiter")) {
                lastNode = PxExpressionParser.nestParameters(root, paramBuffer);
            } else {
                paramBuffer.push(node);
                lastNode = node;
            }
        });

        if (isGroup) {
            PxExpressionParser.nestParameters(root, paramBuffer);
        }
    }
}
