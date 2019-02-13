var ExpressionParser = /** @class */ (function () {
    function ExpressionParser() {
    }
    ExpressionParser.prototype.propValueToLongForm = function (stringForm) {
        if (!stringForm.startsWith("$")) {
            throw new Error("Invalid property value expression \"" + stringForm + "\": variable name expected.");
        }
        var iPath = stringForm.indexOf(".");
        return {
            "$$": iPath > 0 ? stringForm.substring(0, iPath) : stringForm,
            ":property": {
                "@path": iPath > 0 ? stringForm.substring(iPath + 1) : ""
            }
        };
    };
    ExpressionParser.prototype.parseExpressionParams = function (params) {
    };
    ExpressionParser.prototype.tryParseInputAndExpressionKey = function (parent, key, value) {
        var iXpr = key.indexOf(":");
        if (iXpr < 0) {
            return null;
        }
        if (iXpr === 0) {
            if (parent["$$"] === undefined) {
                parent["$$"] = "$$";
            }
            return value;
        }
        delete parent[key];
        parent["$$"] = this.propValueToLongForm(key.substring(0, iXpr));
        parent[key.substring(iXpr)] = value;
        return value;
    };
    ExpressionParser.prototype.stringValueToLongForm = function (stringForm) {
        return this.propValueToLongForm(stringForm);
    };
    ExpressionParser.prototype.expandExpression = function (xpr) {
        var _this = this;
        if (typeof xpr === "string") {
            return this.stringValueToLongForm(xpr);
        }
        var xprParams = null;
        // TODO: check for constant value type.
        var out = Object.assign({}, xpr);
        Object.keys(out).forEach(function (key) {
            var p = _this.tryParseInputAndExpressionKey(out, key, out[key]);
            if (p != null) {
                if (xprParams != null) {
                    throw new Error("Only one expression type may be identified in an expression block.");
                }
                xprParams = p;
            }
            else if (xprParams != null && !key.startsWith("$")) {
                throw new Error("Invalid identifier " + key + ": Only an expression type and variables may be identified in an expression block.");
            }
            else {
                out[key] = _this.expandExpression(out[key]);
            }
        });
        return out;
    };
    return ExpressionParser;
}());
export { ExpressionParser };
//# sourceMappingURL=expression-parser.js.map