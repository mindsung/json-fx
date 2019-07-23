import { describe, it } from "mocha";
import { assert } from "chai";

import { FxNode } from "./fx-node";

describe("lexer/FxNode", function () {

  it("Returns immutable array of children", function () {
    const node = new FxNode();
    node.add(new FxNode());
    node.add(new FxNode());

    const children = node.children;
    children.splice(0, 1);

    assert.equal(node.count, 2, "Expected node to retain all its children");
  });

  it("Binds child node when added to parent", function () {
    const parent = new FxNode();
    const child = new FxNode();

    parent.add(child);

    assert.equal(child.parent, parent, "Expected parent field of child node to be set");
  });

  it("Unbinds child node when removed from parent", function () {
    const parent = new FxNode();
    const child = new FxNode();
    parent.add(child);

    parent.remove(child);

    assert.equal(child.parent, null, "Expected parent field of child not to be null");
  });

  it("Wraps node and retains its index in parent", function () {
    const parent = new FxNode();
    const child1 = new FxNode(), child2 = new FxNode(), child3 = new FxNode();
    const wrapper = new FxNode();
    parent.add(child1);
    parent.add(child2);
    parent.add(child3);

    child2.wrap(wrapper);

    assert.equal(parent.children[1], wrapper, "Expected parent.children[1] to be the wrapping node");
  });
});
