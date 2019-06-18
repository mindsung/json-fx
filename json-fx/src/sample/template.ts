export const sample1 = {

  "$test": {
    "foo": "10",
    "bar": {
      "two": "2"
    }
  },

  "test": "$test.bar.two",
  "test2?": "$test.foo",
  "test3?": "$test.foobar",
  "test4": "$test.foobarbaz",

  "@user": {
    "firstName": "$names.first:randselect()",
    "lastName": "$names.last:randselect()",
    "bio": "@biometric()"
  },

  "@biometric": {
    "$h": "randint(48, 80)",
    "height": "$h",
    "weight": "math~round($h * 2.5 + rand())",
  }
};
