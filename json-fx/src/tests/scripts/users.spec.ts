import { describe, it } from "mocha";
import { assert } from "chai";
import { ScriptTester } from "../script-tester";

describe("Scripts [users]", function (): void {

  const tester = new ScriptTester({
    name: "$",
    value: [
      {
        id: 0,
        name: "Alysa Drucker",
        age: 19,
        gender: "F"
      },
      {
        id: 1,
        name: "Lenny Veillon",
        age: 32,
        gender: "male"
      },
      {
        id: 2,
        name: "Alline Roache",
        age: 41,
        gender: "female"
      },
      {
        id: 3,
        name: "Jess Esper",
        age: 16,
        gender: "f"
      },
      {
        id: 4,
        name: "Colton Melillo",
        age: 66,
        gender: "m"
      }
    ]
  });

  it("Evaluates JSON number", function (): void {
    const result = tester.run({ "()": 10 });
    assert.equal(result, 10);
  });

  it("Evaluates JSON true/false", function (): void {
    const result1 = tester.run({ "()": true });
    const result2 = tester.run({ "()": false });
    assert.equal(result1, true);
    assert.equal(result2, false);
  });

  it("Evaluates JSON null", function (): void {
    const result = tester.run({ "()": null });
    assert.equal(result, null);
  });

  it("Evaluates variable reference", function (): void {
    const result = tester.run({ "$a": 10, "()": "$a" });
    assert.equal(result, 10);
  });

  it("Evaluates nested variable reference", function (): void {
    const result = tester.run({ "$a": 10, "$b": "$a + 10", "()": "$b" });
    assert.equal(result, 20);
  });

  it("Evaluates template reference (w/o args)", function (): void {
    const result = tester.run({ "@templ": 50, "()": "@templ()" });
    assert.equal(result, 50);
  });

  it("Evaluates template reference (w/ args)", function (): void {
    const result = tester.run({ "@templ($)": "$ + 10", "()": "@templ(10)" });
    assert.equal(result, 20);
  });

  it("Evaluates nested template reference", function (): void {
    const result = tester.run({ "@A($)": "$ + 10", "@B($)": "@A($) + 20", "()": "@B(10)" });
    assert.equal(result, 40);
  });

  it("Evaluates array literal", function (): void {
    const result = tester.run("[0, 1, 2, 'A']");
    assert.deepEqual(result, [0, 1, 2, "A"]);
  });

  it("Evaluates object literal", function (): void {
    const result = tester.run("{ $a: 10, @templ($): $ * 2, (): @templ($a) }");
    assert.equal(result, 20);
  });

  it("Evaluates binary operation", function (): void {
    const result = tester.run("9.5 + 0.5");
    assert.equal(result, 10);
  });

  it("Evaluates unary (-)", function (): void {
    const result1 = tester.run("-10");
    const result2 = tester.run("2 * -10");
    const result3 = tester.run("2 * -(5 + 5)");
    assert.equal(result1, -10);
    assert.equal(result2, -20);
    assert.equal(result3, -20);
  });

  it("Throws unary (-) right of operand", function (): void {
    assert.throw(function (): void {
      tester.run("10-");
    });
    assert.throw(function (): void {
      tester.run("(10 + 5)-");
    });
  });

  it("Throws unclosed bracket", function (): void {
    assert.throw(function (): void {
      tester.run("(10");
    });
  });

  it("Throws mismatched brackets", function (): void {
    assert.throw(function (): void {
      tester.run("(10]");
    });
  });

  it("Throws undefined variable", function (): void {
    assert.throw(function (): void {
      tester.run("$a");
    });
  });

  it("Throws undefined template", function (): void {
    assert.throw(function (): void {
      tester.run("@a");
    });
  });

  it("Throws missing operand", function (): void {
    assert.throw(function (): void {
      tester.run("3 *");
    });
  });

  it("Evaluates complex script [emails]", function (): void {
    const result = tester.run({
      "@email($first, $last, $domain)": "lowercase($first[0] + $last) + '@' + $domain",
      "@user($u)": {
        "$names": "$u.name:split(' ')",
        "firstName": "$names[0]",
        "lastName": "$names[1]"
      },
      "()": "$:map(@user):map($ => @email($.firstName, $.lastName, 'gmail.com'))"
    });

    assert.deepEqual(result, [
      "adrucker@gmail.com",
      "lveillon@gmail.com",
      "aroache@gmail.com",
      "jesper@gmail.com",
      "cmelillo@gmail.com"
    ]);
  });

  it("Evaluates complex script [class]", function (): void {
    const result = tester.run({
      "@class($age)": {
        "$minor": "'Minor' if $age < 18 else false",
        "$under21": "'Under 21' if $age < 21 else false",
        "()": "$minor || $under21 || 'Adult'"
      },
      "()": "$:map($ => ${id}:assign({ class: @class($.age) }))"
    });

    assert.deepEqual(result, [
      { "id": 0, "class": "Under 21" },
      { "id": 1, "class": "Adult" },
      { "id": 2, "class": "Adult" },
      { "id": 3, "class": "Minor" },
      { "id": 4, "class": "Adult" }
    ]);
  });

  it("Evaluates complex script [sanitizer]", function (): void {
    const result = tester.run({
      "@sanitizeGender($g)": {
        "$code": "lowercase($g[0])",
        "$m": "'male' if $code == 'm' else null",
        "$f": "'female' if $code == 'f' else null",
        "()": "$m || $f || 'other'"
      },
      "@user($u)": {
        "{ $u as $ }": "$",
        "gender": "@sanitizeGender($u.gender)"
      },
      "()": "map($, @user)"
    });

    assert.deepEqual(result, [
      {
        "age": 19,
        "gender": "female",
        "id": 0,
        "name": "Alysa Drucker"
      },
      {
        "age": 32,
        "gender": "male",
        "id": 1,
        "name": "Lenny Veillon"
      },
      {
        "age": 41,
        "gender": "female",
        "id": 2,
        "name": "Alline Roache"
      },
      {
        "age": 16,
        "gender": "female",
        "id": 3,
        "name": "Jess Esper"
      },
      {
        "age": 66,
        "gender": "male",
        "id": 4,
        "name": "Colton Melillo"
      }
    ]);
  });
});
