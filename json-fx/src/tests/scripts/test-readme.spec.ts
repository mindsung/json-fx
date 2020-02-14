import { JsonFx } from "../..";
import { assert } from "chai";

function test($: any, template: any, expect: any) {
  assert.deepEqual(new JsonFx().compile(template).evaluate({ name: "$", value: $ }), expect);
}

describe("Examples from readme", () => {

  it("should run example 1", () => {
    test({ "a": 2, "b": 4 }, "$.a + $.b", 6);
  });

  it("should run example 2", () => {
    const $ = {
      "organization": { "name": "ACME Coding", "country": "New Zealand" },
      "people": [
        { "firstName": "John", "lastName": "Smith", "age": 66 },
        { "firstName": "Sue", "lastName": "Smith", "age": 34 }
      ]
    };
    test($,
      { "retirementAgeEmployees": "$.people:filter($p => $p.age >= 65):length()" },
      { "retirementAgeEmployees": 1 }
    );
    test($,
      {
        "@mappedPerson($p)": {
          "name": "$p.firstName + ' ' + $p.lastName",
          "countryOfEmployment": "$.organization.country",
          "canRetire": "$p.age >= 65"
        },
        "peopleAnotherWay": "$.people:map(@mappedPerson)"
      },
      {
        "peopleAnotherWay":  [
          { "name": "John Smith", "countryOfEmployment": "New Zealand", "canRetire": true },
          { "name": "Sue Smith", "countryOfEmployment": "New Zealand", "canRetire": false }
        ]
      }
    );
  });
});
