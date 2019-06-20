import {describe, it} from "mocha";
import {assert} from "chai";

import {FxTokenizer} from "./fx-tokenizer";
import {FxToken} from "./model/fx-token";

describe("FxTokenizer", function () {

  describe("FxTokenizer (single token)", function () {

    it("Parses a single identifier", function () {
      const tokenizer = new FxTokenizer();
      const result = tokenizer.parse("foo_123");
      assert.deepEqual<FxToken[]>(result, [{symbol: "foo_123", tag: "identifier", index: 0}]);
    });

    it("Parses a single variable", function () {
      const tokenizer = new FxTokenizer();
      const result = tokenizer.parse("$foo_123");
      assert.deepEqual<FxToken[]>(result, [{symbol: "$foo_123", tag: "variable", index: 0}]);
    });

    it("Parses a single template", function () {
      const tokenizer = new FxTokenizer();
      const result = tokenizer.parse("@foo_123");
      assert.deepEqual<FxToken[]>(result, [{symbol: "@foo_123", tag: "template", index: 0}]);
    });

    it("Parses a single literal", function () {
      const tokenizer = new FxTokenizer();
      const result = tokenizer.parse("`foo 123`");
      assert.deepEqual<FxToken[]>(result, [{symbol: "foo 123", tag: "literal", index: 0}]);
    });

    it("Parses a single number (integer)", function () {
      const tokenizer = new FxTokenizer();
      const result = tokenizer.parse("123");
      assert.deepEqual<FxToken[]>(result, [{symbol: "123", tag: "numeric", index: 0}]);
    });

    it("Parses a single number (decimal)", function () {
      const tokenizer = new FxTokenizer();
      const result = tokenizer.parse("123.45");
      assert.deepEqual<FxToken[]>(result, [{symbol: "123.45", tag: "numeric", index: 0}]);
    });

    it("Parses a single operator", function () {
      const tokenizer = new FxTokenizer();
      const result = tokenizer.parse("*");
      assert.deepEqual<FxToken[]>(result, [{symbol: "*", tag: "operator", index: 0}]);
    });
  });

  it("Delimits between whitespace", function () {
    const tokenizer = new FxTokenizer();
    const result = tokenizer.parse("$foo_123 bar");

    assert.deepEqual<FxToken[]>(result, [
      {symbol: "$foo_123", tag: "variable", index: 0},
      {symbol: "bar", tag: "identifier", index: 9}
    ]);
  });

  it("Filters out whitespace", function () {
    const tokenizer = new FxTokenizer();
    const result = tokenizer.parse(" a b c ");

    assert.deepEqual<FxToken[]>(result, [
      {symbol: "a", tag: "identifier", index: 1},
      {symbol: "b", tag: "identifier", index: 3},
      {symbol: "c", tag: "identifier", index: 5}
    ]);
  });

  it("Prevents merging of adjacent bracket/literal symbols", function () {
    const tokenizer = new FxTokenizer();
    const result1 = tokenizer.parse("(())");

    assert.deepEqual<FxToken[]>(result1, [
      {symbol: "(", tag: "group", index: 0},
      {symbol: "(", tag: "group", index: 1},
      {symbol: ")", tag: "group-close", index: 2},
      {symbol: ")", tag: "group-close", index: 3}
    ]);

    const result2 = tokenizer.parse("[{ }]");
    assert.deepEqual<FxToken[]>(result2, [
      {symbol: "[", tag: "group", index: 0},
      {symbol: "{", tag: "group", index: 1},
      {symbol: "}", tag: "group-close", index: 3},
      {symbol: "]", tag: "group-close", index: 4}
    ]);

    const result3 = tokenizer.parse("`A``B`");
    assert.deepEqual<FxToken[]>(result3, [
      {symbol: "A", tag: "literal", index: 0},
      {symbol: "B", tag: "literal", index: 3}
    ]);
  });

  it("Merges adjacent operator symbols", function () {
    const tokenizer = new FxTokenizer();
    const result = tokenizer.parse("**");
    assert.deepEqual<FxToken[]>(result, [{symbol: "**", tag: "operator", index: 0}]);
  });

  it("Parses a complex expression", function () {
    const tokenizer = new FxTokenizer();
    const result = tokenizer.parse("($var1.bar2 * 2.5 + `baz boz`):map(@template)");

    assert.deepEqual<FxToken[]>(result, [
      {symbol: "(", tag: "group", index: 0},
      {symbol: "$var1", tag: "variable", index: 1},
      {symbol: ".", tag: "operator", index: 6},
      {symbol: "bar2", tag: "identifier", index: 7},
      {symbol: "*", tag: "operator", index: 12},
      {symbol: "2.5", tag: "numeric", index: 14},
      {symbol: "+", tag: "operator", index: 18},
      {symbol: "baz boz", tag: "literal", index: 20},
      {symbol: ")", tag: "group-close", index: 29},
      {symbol: ":", tag: "operator", index: 30},
      {symbol: "map", tag: "identifier", index: 31},
      {symbol: "(", tag: "group", index: 34},
      {symbol: "@template", tag: "template", index: 35},
      {symbol: ")", tag: "group-close", index: 44}
    ]);
  });
});
