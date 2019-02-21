import { FxNode } from "./fx-node";
import { FxOperator } from "./fx-operator";
var FxOperatorParser = /** @class */ (function () {
    function PxOperatorParser() {
    }
    PxOperatorParser.shiftOperatorStack = function (operatorStack, terms) {
        var item = operatorStack.shift();
        if (terms.length !== 2) {
            throw new Error("Expected two arguments to addOperator \"" + item.op.symbol + "\"");
        }
        if (item.op.symbol === '=') {
            terms.shift().addChild(terms.shift());
            item.node.orphan();
        }
        else {
            for (var i = 0; i < 2; i++) {
                var param = new FxNode('@param', 'parameter');
                item.node.addChild(param).addChild(terms.shift());
            }
        }
        item.node.value = item.op.expr;
        item.node.removeTags();
        item.node.addTags('expression');
        terms.push(item.node);
    };
    PxOperatorParser.prototype.evaluate = function (root) {
        var operatorStack = [];
        var terms = [];
        root.forEachChild(function (index, node) {
            if (node.isTagged('operator')) {
                var op = PxOperatorParser.operators[node.value] || new FxOperator(node.value, ':undefined', 99);
                while (operatorStack.length > 0 && operatorStack[0].op.precedence > op.precedence) {
                    PxOperatorParser.shiftOperatorStack(operatorStack, terms);
                }
                operatorStack.unshift({ node: node, op: op });
            }
            else {
                terms.push(node);
            }
        });
        while (operatorStack.length > 0) {
            PxOperatorParser.shiftOperatorStack(operatorStack, terms);
        }
    };
    PxOperatorParser.operators = {
        '=': new FxOperator('=', ':set', 0),
        '&&': new FxOperator('&&', ':and', 1),
        '||': new FxOperator('||', ':or', 1),
        '==': new FxOperator('==', ':equalTo', 2),
        '!=': new FxOperator('!=', ':notEqualTo', 2),
        '<': new FxOperator('<', ':lessThan', 2),
        '<=': new FxOperator('<=', ':lessThanOrEqualTo', 2),
        '>': new FxOperator('>', ':greaterThan', 2),
        '>=': new FxOperator('>=', ':greaterThanOrEqualTo', 2),
        '+': new FxOperator('+', ':add', 3),
        '-': new FxOperator('-', ':sub', 3),
        '*': new FxOperator('*', ':mul', 4),
        '/': new FxOperator('/', ':div', 4)
    };
    return PxOperatorParser;
}());
export { FxOperatorParser };
//# sourceMappingURL=fx-addOperator-parser.js.map
