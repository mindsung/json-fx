import { PxNode } from "./px-node";
var PxGrouper = /** @class */ (function () {
    function PxGrouper() {
    }
    PxGrouper.bracketsMatch = function (open, close) {
        return open === '(' && close === ')'
            || open === '[' && close === ']'
            || open === '{' && close === '}';
    };
    PxGrouper.nest = function (root, lastToken, nextToken) {
        if (lastToken.isTagged('expression')) {
            return lastToken;
        }
        else {
            root.addChild(nextToken);
            return nextToken;
        }
    };
    PxGrouper.getTokenType = function (token) {
        if (token.isTagged('group')) {
            if (token.isTagged('close')) {
                return 'close';
            }
            else {
                return 'open';
            }
        }
        else {
            return 'value';
        }
    };
    PxGrouper.prototype.evaluate = function (tokens) {
        var global = new PxNode('global', 'global');
        var root = global;
        var lastToken = null;
        var bracketStack = [];
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var child = tokens_1[_i];
            var type = PxGrouper.getTokenType(child);
            switch (type) {
                case 'open':
                    root.addChild(child);
                    lastToken = null;
                    root = child;
                    break;
                case 'close':
                    lastToken = root;
                    root = root.getParent();
                    break;
                case 'value':
                    lastToken = root.addChild(child);
                    break;
            }
        }
        if (root !== global) {
            throw new Error("Unclosed \"" + root.value + "\"");
        }
        return global;
    };
    return PxGrouper;
}());
export { PxGrouper };
//# sourceMappingURL=px-grouper.js.map