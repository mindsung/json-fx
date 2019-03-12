import { FxNode } from "./fx-node";
var FxTokenizer = /** @class */ (function () {
    function PxTokenizer() {
    }
    PxTokenizer.classify = function (token) {
        var c = token.value;
        if (c === '.' || /\d/.test(c)) {
            token.addTags('identifier', 'numeric');
        }
        else if (c === ':') {
            token.addTags('expression');
        }
        else if (c === '@') {
            token.addTags('parameter');
        }
        else if (c === '`') {
            token.addTags('literal');
        }
        else if (/[\[({]/.test(c)) {
            token.addTags('group', 'open');
        }
        else if (/[\])}]/.test(c)) {
            token.addTags('group', 'close');
        }
        else if (c === ',') {
            token.addTags('delimiter');
        }
        else if (/[\w$_]/i.test(c)) {
            token.addTags('identifier');
        }
        else if (!c || /\s/.test(c)) {
            token.addTags('space');
        }
        else {
            token.addTags('operator');
        }
    };
    PxTokenizer.canMergeTokens = function (lastToken, nextToken) {
        return !lastToken.isTaggedAny()
            || lastToken.isTaggedAny.apply(lastToken, nextToken.getTags()) && !lastToken.isTagged('group')
            || lastToken.isTaggedAny('expression', 'parameter') && nextToken.isTagged('identifier')
            || lastToken.value === '$' && nextToken.value === '*'; // Special case for "$*"
    };
    PxTokenizer.mergeTokens = function (lastToken, nextToken) {
        lastToken.value += nextToken.value;
        if (!lastToken.isTaggedAny()) {
            lastToken.addTags.apply(lastToken, nextToken.getTags());
        }
    };
    PxTokenizer.prototype.evaluate = function (expr) {
        var tokens = [new FxNode()];
        var lastToken = tokens[0];
        var split = function (next) {
            lastToken = next;
            tokens.push(lastToken);
        };
        var isLiteral = false;
        for (var i = 0; i < expr.length; i++) {
            var nextToken = new FxNode(expr[i]);
            PxTokenizer.classify(nextToken);
            if (nextToken.isTagged('literal')) {
                isLiteral = !isLiteral;
                split(new FxNode());
            }
            else if (PxTokenizer.canMergeTokens(lastToken, nextToken) || isLiteral) {
                PxTokenizer.mergeTokens(lastToken, nextToken);
            }
            else {
                split(nextToken);
            }
        }
        return tokens.filter(function (el) { return el.isTaggedAny() && !el.isTagged('space'); });
    };
    return PxTokenizer;
}());
export { FxTokenizer };
//# sourceMappingURL=fx-tokenizer.js.map
