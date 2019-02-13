var PxNode = /** @class */ (function () {
    function PxNode(value) {
        if (value === void 0) { value = ""; }
        var tags = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            tags[_i - 1] = arguments[_i];
        }
        this.value = value;
        this.parent = null;
        this.children = [];
        this.tags = tags;
    }
    PxNode.prototype.getTags = function () {
        return this.tags;
    };
    PxNode.prototype.isTagged = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        if (tags.length === 0) {
            return this.tags.length > 0;
        }
        else {
            for (var _a = 0, tags_1 = tags; _a < tags_1.length; _a++) {
                var tag = tags_1[_a];
                if (this.tags.indexOf(tag) === -1) {
                    return false;
                }
            }
            return true;
        }
    };
    PxNode.prototype.isTaggedAny = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        if (tags.length === 0) {
            return this.tags.length > 0;
        }
        else {
            for (var _a = 0, tags_2 = tags; _a < tags_2.length; _a++) {
                var tag = tags_2[_a];
                if (this.tags.indexOf(tag) !== -1) {
                    return true;
                }
            }
            return false;
        }
    };
    PxNode.prototype.removeTags = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        if (tags.length === 0) {
            this.tags = [];
        }
        else {
            for (var _a = 0, tags_3 = tags; _a < tags_3.length; _a++) {
                var tag = tags_3[_a];
                var i = this.tags.indexOf(tag);
                if (i !== -1) {
                    this.tags.splice(i, 1);
                }
            }
        }
    };
    PxNode.prototype.addTags = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        for (var _a = 0, tags_4 = tags; _a < tags_4.length; _a++) {
            var tag = tags_4[_a];
            if (this.tags.indexOf(tag) === -1) {
                this.tags.push(tag);
            }
        }
    };
    PxNode.prototype.getParent = function () {
        return this.parent;
    };
    PxNode.prototype.setParent = function (parent, unshift) {
        var _this = this;
        if (unshift === void 0) { unshift = false; }
        if (parent !== this.parent) {
            if (this.parent !== null) {
                this.parent.children = this.parent.children.filter(function (el) { return el !== _this; });
            }
            this.parent = parent;
            if (this.parent !== null) {
                if (unshift) {
                    this.parent.children.unshift(this);
                }
                else {
                    this.parent.children.push(this);
                }
            }
        }
        return parent;
    };
    PxNode.prototype.firstChild = function () {
        return this.children[0] || null;
    };
    PxNode.prototype.lastChild = function () {
        return this.children[this.children.length - 1] || null;
    };
    PxNode.prototype.forEachChild = function (callback) {
        for (var i = 0; i < this.children.length; i++) {
            callback(i, this.children[i]);
        }
    };
    PxNode.prototype.addChild = function (child, unshift) {
        if (unshift === void 0) { unshift = false; }
        if (child !== null) {
            child.setParent(this, unshift);
        }
        return child;
    };
    PxNode.prototype.insertChild = function (child, target, after) {
        if (after === void 0) { after = false; }
        var index = this.children.indexOf(target);
        if (index !== -1) {
            this.children.splice(after ? index + 1 : index, 0, child);
        }
        else {
            this.addChild(child, !after);
        }
        return child;
    };
    PxNode.prototype.transferChildren = function (target, unshift) {
        if (unshift === void 0) { unshift = false; }
        while (this.children.length > 0) {
            if (unshift) {
                target.addChild(this.children[this.children.length - 1], true);
            }
            else {
                target.addChild(this.children[0]);
            }
        }
        return target;
    };
    PxNode.prototype.orphan = function () {
        this.setParent(null);
        return this;
    };
    PxNode.prototype.unwrap = function () {
        if (this.parent !== null) {
            while (this.children.length > 0) {
                this.parent.insertChild(this.children[0], this);
            }
        }
        return this.orphan();
    };
    PxNode.prototype.toString = function () {
        return this.value.toString();
    };
    return PxNode;
}());
export { PxNode };
//# sourceMappingURL=px-node.js.map