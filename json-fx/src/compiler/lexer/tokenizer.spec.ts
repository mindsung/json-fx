import {describe, it} from "mocha";
import {assert} from "chai";

import {Tokenizer} from "./tokenizer";

describe("lexer/Tokenizer", function () {

  it("Parses an empty string", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("");
    assert.deepEqual(result, []);
  });

  it("Parses a single identifier", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("foo_123");
    assert.deepEqual(result, [{tag: "identifier", symbol: "foo_123", index: 0}]);
  });

  it("Parses a single variable", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("$foo_123");
    assert.deepEqual(result, [{tag: "variable", symbol: "$foo_123", index: 0}]);
  });

  it("Parses a single template", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("@foo_123");
    assert.deepEqual(result, [{tag: "template", symbol: "@foo_123", index: 0}]);
  });

  it("Parses a single literal", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("`foo 123`");
    assert.deepEqual(result, [{tag: "literal", symbol: "foo 123", index: 0}]);
  });

  it("Parses a single number (integer)", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("123");
    assert.deepEqual(result, [{tag: "numeric", symbol: "123", index: 0}]);
  });

  it("Parses a single number (decimal)", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("123.45");
    assert.deepEqual(result, [{tag: "numeric", symbol: "123.45", index: 0}]);
  });

  it("Parses a single operator", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("*");
    assert.deepEqual(result, [{tag: "operator", symbol: "*", index: 0}]);
  });

  it("Delimits between whitespace", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("$foo_123 bar");

    assert.deepEqual(result, [
      {tag: "variable", symbol: "$foo_123", index: 0},
      {tag: "identifier", symbol: "bar", index: 9}
    ]);
  });

  it("Filters out whitespace", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse(" a b c ");

    assert.deepEqual(result, [
      {tag: "identifier", symbol: "a", index: 1},
      {tag: "identifier", symbol: "b", index: 3},
      {tag: "identifier", symbol: "c", index: 5}
    ]);
  });

  it("Prevents merging of adjacent bracket/literal symbols", function () {
    const tokenizer = new Tokenizer();
    const result1 = tokenizer.parse("(())");

    assert.deepEqual(result1, [
      {tag: "group", symbol: "(", index: 0},
      {tag: "group", symbol: "(", index: 1},
      {tag: "group-close", symbol: ")", index: 2},
      {tag: "group-close", symbol: ")", index: 3}
    ]);

    const result2 = tokenizer.parse("[{ }]");
    assert.deepEqual(result2, [
      {tag: "group", symbol: "[", index: 0},
      {tag: "group", symbol: "{", index: 1},
      {tag: "group-close", symbol: "}", index: 3},
      {tag: "group-close", symbol: "]", index: 4}
    ]);

    const result3 = tokenizer.parse("`A``B`");
    assert.deepEqual(result3, [
      {tag: "literal", symbol: "A", index: 0},
      {tag: "literal", symbol: "B", index: 3}
    ]);
  });

  it("Merges adjacent operator symbols", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("**");
    assert.deepEqual(result, [{tag: "operator", symbol: "**", index: 0}]);
  });

  it("Parses a complex expression", function () {
    const tokenizer = new Tokenizer();
    const result = tokenizer.parse("($var1.bar2 * 2.5 + `baz boz`):map(@template)");

    assert.deepEqual(result, [
      {tag: "group", symbol: "(", index: 0},
      {tag: "variable", symbol: "$var1", index: 1},
      {tag: "operator", symbol: ".", index: 6},
      {tag: "identifier", symbol: "bar2", index: 7},
      {tag: "operator", symbol: "*", index: 12},
      {tag: "numeric", symbol: "2.5", index: 14},
      {tag: "operator", symbol: "+", index: 18},
      {tag: "literal", symbol: "baz boz", index: 20},
      {tag: "group-close", symbol: ")", index: 29},
      {tag: "operator", symbol: ":", index: 30},
      {tag: "identifier", symbol: "map", index: 31},
      {tag: "group", symbol: "(", index: 34},
      {tag: "template", symbol: "@template", index: 35},
      {tag: "group-close", symbol: ")", index: 44}
    ]);
  });
});
