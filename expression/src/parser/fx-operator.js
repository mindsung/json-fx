var FxOperator = /** @class */ (function () {
    function PxOperator(symbol, expr, precedence, assoc) {
        if (assoc === void 0) { assoc = 'left'; }
        this.symbol = symbol;
        this.expr = expr;
        this.precedence = precedence;
        this.assoc = assoc;
    }
    return PxOperator;
}());
export { FxOperator };
//# sourceMappingURL=fx-addOperator.js.map
