import { PxNode } from "./px-node";
import { PxOperator } from "./px-operator";
var PxOperatorParser = /** @class */ (function () {
    function PxOperatorParser() {
    }
    PxOperatorParser.shiftOperatorStack = function (operatorStack, terms) {
        var item = operatorStack.shift();
        if (terms.length !== 2) {
            throw new Error("Expected two arguments to operator \"" + item.op.symbol + "\"");
        }
        if (item.op.symbol === '=') {
            terms.shift().addChild(terms.shift());
            item.node.orphan();
        }
        else {
            for (var i = 0; i < 2; i++) {
                var param = new PxNode('@param', 'parameter');
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
                var op = PxOperatorParser.operators[node.value] || new PxOperator(node.value, ':undefined', 99);
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
        '=': new PxOperator('=', ':set', 0),
        '&&': new PxOperator('&&', ':and', 1),
        '||': new PxOperator('||', ':or', 1),
        '==': new PxOperator('==', ':equalTo', 2),
        '!=': new PxOperator('!=', ':notEqualTo', 2),
        '<': new PxOperator('<', ':lessThan', 2),
        '<=': new PxOperator('<=', ':lessThanOrEqualTo', 2),
        '>': new PxOperator('>', ':greaterThan', 2),
        '>=': new PxOperator('>=', ':greaterThanOrEqualTo', 2),
        '+': new PxOperator('+', ':add', 3),
        '-': new PxOperator('-', ':sub', 3),
        '*': new PxOperator('*', ':mul', 4),
        '/': new PxOperator('/', ':div', 4)
    };
    return PxOperatorParser;
}());
export { PxOperatorParser };
//# sourceMappingURL=px-operator-parser.js.map