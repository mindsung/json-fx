var PxNodeParser = /** @class */ (function () {
    function PxNodeParser() {
        var parsers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parsers[_i] = arguments[_i];
        }
        this.parsers = parsers;
    }
    PxNodeParser.prototype.evaluate = function (root) {
        for (var _i = 0, _a = this.parsers; _i < _a.length; _i++) {
            var parser = _a[_i];
            this.evaluateTree(root, parser);
        }
    };
    PxNodeParser.prototype.evaluateTree = function (root, parser) {
        var _this = this;
        root.forEachChild((function (index, node) {
            _this.evaluateTree(node, parser);
        }));
        parser.evaluate(root);
    };
    return PxNodeParser;
}());
export { PxNodeParser };
//# sourceMappingURL=px-node-parser.js.map