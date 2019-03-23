# json-fx
**json-fx** is a JSON template syntax parser, ideal for transforming or querying JavaScript objects or JSON documents. It defines an intuitive syntax for expressing an output object as a function of one or more inputs.

Templates are compiled at run-time into expression trees that are very lightweight wrappers around the JavaScript code they expose. The library includes a large collection of built-in expressions, and it can be easily extended by consumers or by third-party libraries.

## A very simple example

Given an input object:
```json
{ "a": 2, "b": 4 }
```
And a template:
```json
"$.a + $.b"
```
Yields the output:
```json
6
```
## Another simple example

Given an input object:
```json
{
  "organization": { "name": "ACME Coding", "country": "New Zealand" },
  "people": [
    { "firstName": "John", "lastName": "Smith", "age": 66 },
    { "firstName": "Sue", "lastName": "Smith", "age": 34 }
  ]
}
```
And a template:
```json
{
  "$org": "$.organization",
  "$.people:map": {
    "name": "$.firstName + ' ' + $.lastName",
    "countryOfEmployment": "$org.country",
    "canRetire": "$.age >= 65"
  }
}
```
Yields the output:
```json
[
  { "name": "John Smith", "countryOfEmployment": "New Zealand", "canRetire": true },
  { "name": "Sue Smith", "countryOfEmployment": "New Zealand", "canRetire": false }
]
```
Or a template:
```json
{ "retirementAgeEmployees": "$.people:filter($.age >= 65):length" }
```
Yields the output:
```json
{ "retirementAgeEmployees": 1 }
```
# Use cases

**json-fx** may be helpful any time a readable expression syntax is more desirable or practical than writing code for manipulating or extracting elements from JavaScript objects. But it is especially useful when a dynamic, run-time solution is required for transforming or querying into complex JSON objects, when it’s not possible or practical to hard-code the logic into your application. For example:


- Templates could be constructed and maintained by an intuitive user interface that would allow application users to select data elements they want to be included in reports
- Application developers, or non-programmers who have learned the expression syntax, could create, save, and maintain a set of data extraction or transform templates without requiring code to be changed and re-deployed as the data requirements change
