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
        age: 23,
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

  it("Evaluates script [simple]", function (): void {
    const result = tester.run("{$a: 10, (): $a}");
    console.log(JSON.stringify(result, null, 2));
  });

  it("Evaluates script [emails]", function (): void {
    const result = tester.run({
      "@email($first, $last, $domain)": "lowercase($first[0] + $last) + '@' + $domain",
      "@user($u)": {
        "$names": "$u.name:split(' ')",
        "firstName": "$names[0]",
        "lastName": "$names[1]"
      },
      "()": "$::@user:map($ => @email($.firstName, $.lastName, 'gmail.com'))"
    });

    assert.deepEqual(result, [
      "adrucker@gmail.com",
      "lveillon@gmail.com",
      "aroache@gmail.com",
      "jesper@gmail.com",
      "cmelillo@gmail.com"
    ]);
  });
});
