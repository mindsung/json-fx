import { describe, it } from "mocha";
import { assert } from "chai";

import { Tokenizer } from "./tokenizer";
import { Grouper } from "./grouper";
import { FxTokenNode } from "./model/fx-token-node";

describe("lexer/Grouper", function () {

  function parse(expr: string) {
    const tokenizer = new Tokenizer();
    const grouper = new Grouper();
    return grouper.parse(tokenizer.parse(expr));
  }

  it("Creates global token (no groups)", function () {
    const grouper = new Grouper();
    const result = parse("foo");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",
      children: [{tag: "identifier", symbol: "foo", index: 0}]
    }));
  });

  it("Parses empty parentheses", function () {
    const grouper = new Grouper();
    const result = parse("()");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",
      children: [{tag: "group", symbol: "()", index: 0}]
    }));
  });

  it("Parses empty square brackets", function () {
    const grouper = new Grouper();
    const result = parse("[]");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",
      children: [{tag: "array", symbol: "[]", index: 0}]
    }));
  });

  it("Parses empty curly brackets", function () {
    const grouper = new Grouper();
    const result = parse("{}");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",
      children: [{tag: "object", symbol: "{}", index: 0}]
    }));
  });

  it("Parses an encapsulated variable", function () {
    const grouper = new Grouper();
    const result = parse("(foo)");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

      children: [{
        tag: "group",
        symbol: "()",
        index: 0,

        children: [{tag: "identifier", symbol: "foo", index: 1}]
      }]
    }));
  });

  it("Parses adjacent groups", function () {
    const grouper = new Grouper();
    const result = parse("(foo)(bar)");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

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

  it("Parses nested brackets", function () {
    const grouper = new Grouper();
    const result = parse("(foo(bar))");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

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

  it("Parses a complex evaluator", function () {
    const grouper = new Grouper();
    const result = parse("($var1.bar2 * 2.5 + 'baz boz'):map(@template)");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

      children: [
        {
          tag: "group",
          symbol: "()",
          index: 0,

          children: [
            {symbol: "$var1", tag: "variable", index: 1},
            {symbol: ".", tag: "operator", index: 6},
            {symbol: "bar2", tag: "identifier", index: 7},
            {symbol: "*", tag: "operator", index: 12},
            {symbol: "2.5", tag: "numeric", index: 14},
            {symbol: "+", tag: "operator", index: 18},
            {symbol: "baz boz", tag: "literal", index: 20}
          ]
        },
        {symbol: ":", tag: "operator", index: 30},
        {symbol: "map", tag: "identifier", index: 31},
        {
          symbol: "()",
          tag: "group",
          index: 34,

          children: [{symbol: "@template", tag: "template", index: 35}]
        }
      ]
    }));
  });

  it("Throws error on unclosed bracket", function () {
    const grouper = new Grouper();
    assert.throw(() => parse("("));
  });

  it("Throws error on unexpected bracket", function () {
    const grouper = new Grouper();
    assert.throw(() => parse(")"));
  });

  it("Throws error on mismatched brackets", function () {
    const grouper = new Grouper();
    assert.throw(() => parse("[)"));
  });
});
