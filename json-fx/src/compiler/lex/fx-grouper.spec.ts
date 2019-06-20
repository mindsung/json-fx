import {expect} from "chai";
import {FxTokenizer} from "./fx-tokenizer";
import {FxGrouper} from "./fx-grouper";
import * as assert from "assert";

function groupExpression(expr: string) {
  const tokenizer = new FxTokenizer();
  const grouper = new FxGrouper();

  return grouper.parse(tokenizer.parse(expr));
}

describe("FxGrouper", () => {
  it("Groups at global level", () => {
    const root = groupExpression("foo(bar)");

    expect(root.tag).to.equal("global");
    expect(root.children[0].tag).to.equal("identifier");
    expect(root.children[1].tag).to.equal("group");
    expect(root.children[1].children[0].tag).to.equal("identifier");
  });

  it("Groups one below global level", () => {
    const root = groupExpression("foo(bar(baz))");

    expect(root.tag).to.equal("global");
    expect(root.children[0].tag).to.equal("identifier");
    expect(root.children[1].tag).to.equal("group");
    expect(root.children[1].children[0].tag).to.equal("identifier");
    expect(root.children[1].children[1].tag).to.equal("group");
    expect(root.children[1].children[1].children[0].tag).to.equal("identifier");
  });

  it("Throws bracket mismatch error", () => {
    assert.throws(() => groupExpression("foo(bar]"), err => err.message === "Brackets do not match");
  });

  it("Throws bracket unclosed error", () => {
    assert.throws(() => groupExpression("foo(bar"), err => err.message.startsWith("Unclosed"));
  });
});
