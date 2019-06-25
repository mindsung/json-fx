# json-fx
**json-fx** is a JavaScript template parser and evaluation engine, ideal for querying and transforming JavaScript objects or JSON documents.
It defines an intuitive syntax for expressing an output value as a function of one or more inputs.

Templates are parsed and compiled at runtime into expression trees, which are very efficient and lightweight wrappers
around the native JavaScript code they execute. The library includes a large collection of built-in expressions,
and is easily extensible by consumers and by third-party libraries.

The json-fx core library, which includes the parser/compiler and built-in expression set, has no external
runtime dependencies, giving it an extremely compact footprint.

## A very simple example

Given an input object $:
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

Given an input object $:
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
{ "retirementAgeEmployees": "$.people:filter($p => $p.age >= 65):length()" }
```
Yields the output:
```json
{ "retirementAgeEmployees": 1 }
```
Or a template:
```json
{
  "@mappedPerson($p)": {
    "name": "$p.firstName + ` ` + $p.lastName",
    "countryOfEmployment": "$.organization.country",
    "canRetire": "$p.age >= 65"
  },
  "peopleAnotherWay": "$.people:map(@mappedPerson)"
}
```
Yields the output:
```json
{
  "peopleAnotherWay":  [
    { "name": "John Smith", "countryOfEmployment": "New Zealand", "canRetire": true },
    { "name": "Sue Smith", "countryOfEmployment": "New Zealand", "canRetire": false }
  ]
}
```
# Use cases

**json-fx** may be useful any time a declarative expression syntax is more desirable or practical than
writing code for manipulating or extracting elements from JavaScript objects. But it is especially useful
when a dynamic, runtime solution is required for transforming or querying into complex JSON objects,
when it’s not possible or practical to hard-code the logic into your application. For example:


- Templates could be constructed and maintained by an intuitive user interface that would allow application
users to select data elements they want to be included in reports
- Application developers, or non-programmers who have learned the json-fx expression syntax, could create, save,
and maintain a set of data extraction or transform templates, without requiring application code to be changed and deployed
