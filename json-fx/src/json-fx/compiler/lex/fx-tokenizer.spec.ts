import { FxTokenizer } from "./fx-tokenizer";
import { expect } from "chai";

function tokenizeExpression(expr: string) {
  const tokenizer = new FxTokenizer();
  return tokenizer.evaluate(expr);
}

function itReturnsTheseTags(expr: string, expectedTags: string[]) {
  it(`Returns tokens from '${expr}' tagged '${expectedTags.join(", ")}'`, () => {
    const tokens = tokenizeExpression(expr);

    tokens.forEach(t => console.log(t.toString()));

    expect(tokens.length).to.equal(expectedTags.length);

    for (let i = 0; i < tokens.length; i++) {
      expect(tokens[i].tag).to.equal(expectedTags[i]);
    }
  });
}

describe("FxNodeTokenizer (1 token)", () => {
  itReturnsTheseTags("12.345", ["numeric"]);
  itReturnsTheseTags("foo", ["identifier"]);
  itReturnsTheseTags("`", ["literal"]);
  itReturnsTheseTags("([{", ["group", "group", "group"]);
  itReturnsTheseTags(")]}", ["group-close", "group-close", "group-close"]);
  itReturnsTheseTags(",", ["delimiter"]);
});

describe("FxNodeTokenizer (>1 tokens)", () => {
  itReturnsTheseTags("$a = 10", ["identifier", "operator", "numeric"]);
  itReturnsTheseTags("$b = `foo`", ["identifier", "operator", "literal"]);

  itReturnsTheseTags("$var = $:sort()", [
    "identifier", "operator", "identifier", "operator", "identifier", "group", "group-close"
  ]);
  itReturnsTheseTags("$.books:first(5)..author", [
    "identifier", "operator", "identifier", "operator", "identifier", "group", "numeric", "group-close", "operator", "identifier"
  ]);
  itReturnsTheseTags("$foo = if($a > $b):then(`hello`):else(`$a = 50`)", [
    "identifier", "operator", "identifier", "group", "identifier", "operator", "identifier", "group-close", // $foo = if ($a > $b)
    "operator", "identifier", "group", "literal", "group-close", "operator", "identifier", "group", "literal", "group-close" // :then(`hello`):else(`$a = 50`)
  ]);
});

describe("FxNodeTokenizer (performance)", () => {
  const iterations = 100000;

  it("Benchmark: $foo = if($a > $b):then(`hello`):else(`$a = 50`)", () => {
    const tokenizer = new FxTokenizer();

    for (let i = 0; i < iterations; i++) {
      tokenizer.evaluate("$foo = if($a > $b):then(`hello`):else(`$a = 50`)");
    }
  });
});
