import { FxNode } from "./fx-node";
var FxExpressionParser = /** @class */ (function () {
    function PxExpressionParser() {
    }
    PxExpressionParser.nestParameters = function (root, buffer) {
        var paramGroup = new FxNode('@param', 'parameter', 'group');
        while (buffer.length > 0) {
            paramGroup.addChild(buffer.shift());
        }
        root.addChild(paramGroup);
        return paramGroup;
    };
    PxExpressionParser.prototype.evaluate = function (root) {
        var lastNode = null;
        var paramBuffer = [];
        var isGroup = root.isTagged('group');
        root.forEachChild(function (index, node) {
            if (node.isTagged('group', 'open') && lastNode.isTagged('expression')) {
                node.transferChildren(lastNode);
                node.orphan();
                paramBuffer.push(lastNode);
            }
            else if (isGroup && node.isTagged('delimiter')) {
                lastNode = PxExpressionParser.nestParameters(root, paramBuffer);
            }
            else {
                paramBuffer.push(node);
                lastNode = node;
            }
        });
        if (isGroup) {
            PxExpressionParser.nestParameters(root, paramBuffer);
        }
    };
    return PxExpressionParser;
}());
export { FxExpressionParser };
//# sourceMappingURL=fx-expression-parser.js.map
