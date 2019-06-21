import {describe, it} from "mocha";
import {assert} from "chai";

import {FxTokenizer} from "./fx-tokenizer";
import {FxGrouper} from "./fx-grouper";
import {FxTokenNode} from "./model/fx-token-node";

describe("FxGrouper", function () {

  function tokenize(expr: string) {
    const tokenizer = new FxTokenizer();
    return tokenizer.parse(expr);
  }

  it("Creates global token (no groups)", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("foo"));

    assert.deepEqual(result, FxTokenNode.from({
      tag: "global",
      symbol: "",
      index: -1,

      children: [{tag: "identifier", symbol: "foo", index: 0}]
    }));
  });

  it("Groups empty parentheses", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("()"));

    assert.deepEqual(result, FxTokenNode.from({
      tag: "global",
      symbol: "",
      index: -1,

      children: [{tag: "group", symbol: "()", index: 0}]
    }));
  });

  it("Groups empty square brackets", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("[]"));

    assert.deepEqual(result, FxTokenNode.from({
      tag: "global",
      symbol: "",
      index: -1,

      children: [{tag: "group", symbol: "[]", index: 0}]
    }));
  });

  it("Groups empty curly brackets", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("{}"));

    assert.deepEqual(result, FxTokenNode.from({
      tag: "global",
      symbol: "",
      index: -1,

      children: [{tag: "group", symbol: "{}", index: 0}]
    }));
  });

  it("Groups an encapsulated variable", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("(foo)"));

    assert.deepEqual(result, FxTokenNode.from({
      tag: "global",
      symbol: "",
      index: -1,

      children: [{
        tag: "group",
        symbol: "()",
        index: 0,

        children: [{tag: "identifier", symbol: "foo", index: 1}]
      }]
    }));
  });

  it("Groups adjacent brackets", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("(foo)(bar)"));

    assert.deepEqual(result, FxTokenNode.from({
      tag: "global",
      symbol: "",
      index: -1,

      children: [
        {
          tag: "group",
          symbol: "()",
          index: 0,

          children: [{tag: "identifier", symbol: "foo", index: 1}]
        },
        {
          tag: "group",
          symbol: "()",
          index: 5,

          children: [{tag: "identifier", symbol: "bar", index: 6}]
        }
      ]
    }));
  });

  it("Groups nested brackets", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("(foo(bar))"));

    assert.deepEqual(result, FxTokenNode.from({
      tag: "global",
      symbol: "",
      index: -1,

      children: [{
        tag: "group",
        symbol: "()",
        index: 0,

        children: [
          {tag: "identifier", symbol: "foo", index: 1},
          {
            tag: "group",
            symbol: "()",
            index: 4,

            children: [{tag: "identifier", symbol: "bar", index: 5}]
          }
        ]
      }]
    }));
  });

  it("Throws error on unclosed bracket", function () {
    const grouper = new FxGrouper();
    assert.throw(() => grouper.parse(tokenize("(")));
  });

  it("Throws error on unexpected bracket", function () {
    const grouper = new FxGrouper();
    assert.throw(() => grouper.parse(tokenize(")")));
  });

  it("Throws error on mismatched brackets", function () {
    const grouper = new FxGrouper();
    assert.throw(() => grouper.parse(tokenize("[)")));
  });
});
