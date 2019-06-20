import {describe, it} from "mocha";
import {assert} from "chai";

import {FxTokenizer} from "./fx-tokenizer";
import {FxGrouper} from "./fx-grouper";

describe("FxGrouper", function () {

  function tokenize(expr: string) {
    const tokenizer = new FxTokenizer();
    return tokenizer.parse(expr);
  }

  it("Creates global node w/o groupings", function () {
    const grouper = new FxGrouper();
    const result = grouper.parse(tokenize("$foo"));

    assert.equal(result.tag, "global");
  });
});
