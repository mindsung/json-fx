import { describe, it } from "mocha";
import { assert } from "chai";

import { Tokenizer } from "./tokenizer";
import { Grouper } from "./grouper";
import { FxTokenNode } from "./model/fx-token-node";
import { ExpressionParser } from "./expression-parser";
import { NodeParser } from "./node-parser";

describe("lexer/ExpressionParser", function () {

  function parse(expr: string) {
    const tokenizer = new Tokenizer();
    const grouper = new Grouper();
    const parser = new NodeParser(new ExpressionParser());

    const result = grouper.parse(tokenizer.parse(expr));
    parser.parse(result);

    return result;
  }

  it("Creates expression from [identifier], [group]", function () {
    const result = parse("foo(bar)");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

      children: [{
        tag: "expression",
        symbol: "foo",
        index: 0,

        children: [{tag: "identifier", symbol: "bar", index: 4}]
      }]
    }));
  });

  it("Creates expression from [template], [group]", function () {
    const result = parse("@foo(bar)");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

      children: [{
        tag: "template-call",
        symbol: "@foo",
        index: 0,

        children: [{
          tag: "signature",
          children: [{tag: "identifier", symbol: "bar", index: 5}]
        }]
      }]
    }));
  });

  it("Won't create expression from [operator], [group]", function () {
    const result = parse("*(bar)");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

      children: [
        {tag: "operator", symbol: "*", index: 0},
        {
          tag: "group",
          symbol: "()",
          index: 1,

          children: [{tag: "identifier", symbol: "bar", index: 2}]
        }]
    }));
  });

  it("Creates expressions from nested calls", function () {
    const result = parse("foo(bar(baz))");

    assert.deepEqual(result, FxTokenNode.from({
      tag: "group",

      children: [{
        tag: "expression",
        symbol: "foo",
        index: 0,

        children: [{
          tag: "expression",
          symbol: "bar",
          index: 4,

          children: [{tag: "identifier", symbol: "baz", index: 8}]
        }]
      }]
    }));
  });
});
