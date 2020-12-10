# JSON-fx
**JSON-fx** is a query and transform engine for JavaScript objects.
It defines an intuitive, declarative syntax for expressing an output value as a function of one or more input values.

Use cases could include any scenario in which the query of values from JSON data, or transformation of entire JSON
objects, is best implemented through runtime configuration rather than hard-coded into application logic.

**JSON-fx** expressions are embedded in JSON objects known as templates which are parsed and compiled at runtime into expression trees. These are efficient and lightweight wrappers around the native JavaScript code they execute. The library includes a large collection of built-in functions and operators and is easily extensible.

The **JSON-fx** core library, which includes the parser/compiler and a built-in set of functions, has no external
runtime dependencies, giving it an extremely compact footprint.

## Installation

```sh
npm install @mindsung/json-fx
```

## Usage

```ts
import { JsonFx } from "@mindsung/json-fx";

const myCustomExtensionFunctions = [
  {
    name: "addFive",
    evaluate: n => n + 5
  }
];

const myInput = {
  someInputProp: 10,
  anotherInputProp: "hello"
};

const myTemplate = {
  "@myRuntimeFunction($a, $b)": "'The answer is: ' + ($a + $b)",
  "$myVar": "'The var is: ' + @myRuntimeFunction($.someInputProp:addFive, 100)",
  "someOutputProp": "'The prop is: ' + $myVar",
  "anotherOutputProp": "'The other prop is: ' + @myRuntimeFunction($.anotherInputProp, 100)"
};

const fx = new JsonFx(myCustomExtensionFunctions);
const compiled = fx.compile(myTemplate);
const output = compiled.evaluate({ name: "$", value: myInput });

console.log(JSON.stringify(output, null, 2));
```

Yields the output:
```json
{
  "someOutputProp": "The prop is: The var is: The answer is: 115",
  "anotherOutputProp": "The other prop is: The answer is: hello100"
}
```

## Template inputs

Template evaluation will typically include one or more input values. Often, there will be only one input,
commonly named "$" as shown in the basic usage example above. However, any number of named input values may be
supplied. These input variable names must begin with "$", and they may be of any type. For example:
```ts
const inputs = [{
  name: "$myInput",
  value: 1000
}, {
  name: "$myOtherInput",
  value: {
    someProp: {
      anEvenDeeperProp: "some value"
    }
  }
}];
const output = compiled.evaluate(...inputs);
```
All inputs may then be referenced by their variable names within a template:
```json
{
  "anOutputProp": "$myInput / 2",
  "anotherOutputProp": "$myOtherInput.someProp.anEvenDeeperProp + ' was input'"
}
```
Which would yield the output:
```json
{
  "anOutputProp": 500,
  "anotherOutputProp": "some value was input"
}
```

## Template expression syntax

Templates may consist of any valid JavaScript value or object. A template could be as simple as a single
constant value (which would of course be useless, as no transformation or evaluation of any kind would
take place), or a single JSON-fx string expression, or a complex JSON-fx object expression.

### String expressions

A JSON-fx string expression is, as the name suggests, a string value, which contains one or more function
calls and/or operators, resulting in exactly one output value or object. It will be parsed by the JSON-fx
runtime when the template is compiled, creating an efficient expression tree that can be evaluated against different input values.


```ts
const compiled = fx.compile("($.n * 6):toString:substr(0, 1)");
const output = compiled.evaluate({ name: "$", value: { n: 5 } }); 
// Output: "3"
```
In the example above, the input property ``$.n`` is multiplied by the constant number ``6``,
resulting in the number ``30``, which is passed into the function ``toString``, the result of which is
passed into the function ``substr`` with arguments ``0, 1``, which returns a string starting at index ``0``
and of length ``1``, resulting in a final expression output value of ``"3"``.

# Alternate example suggestion. Original example is a little confusing because the result is numeric and the expression contains arithmetic, but the output is a string. It also perhaps introduces the invocation ":" operator prematurely which is explained much better further down.

```ts
import { JsonFx } from "@mindsung/json-fx";


const fx = new JsonFx();

const template = "floor($.foo / 10) % 10";
const expression = fx.compile(template);

const input = {
  name: "$",
  value: { foo: 54 }
}

const output = expression.evaluate(input); // output = 3
```

In this example, the input `$` is an object containing a single property `foo`. The template string defines a JSON-fx expression, `floor($.foo / 10)`, which effectively outputs the tens digit of `$.foo` using integer division and the modulus operator. The template is provided to `fx.compile(...)` which converts the string into an expression. Lastly, `expression.evaluate(input)` executes the expression against the provided input and returns the result.

# END of alternate example

#### Functions and operators

[Click here for a reference of all JSON-fx built-in functions and operators](https://github.com/mindsung/json-fx/tree/develop/json-fx/src/fx/functions)

Function calls are the core components of any JSON-fx string expression. All string expressions are
essentially a combination of one or more function evaluations. Even operators are a syntactic shortcut representing a
call to an associated function. For example, the expression ``$a + $b`` is just a shorthand representation
of the function call ``add($a, $b)``.

In JSON-fx expressions, functions may be called using standard JavaScript function call syntax, i.e. the
function name, opening parentheses, comma-separated arguments, and closing parentheses.

``"add($a, $b)"``

They may also be chained together with other values, functions, or expressions using the infix `:` operator.

`$a:add($b)"` is equivalent to `"add($a, $b)`

The left-hand value `$a` is implicitly passed to `add($b)` as the first argument, displacing the other arguments. When chained together, the infix operator provides better clarity in many situations. Example:

`toString(add($a, $b))` is better expressed as `add($a, $b):toString()`,
or even `$a:add($b):toString()`

If the right-hand function requires only one argument (which is implicitly provided by the left-hand operand), then the parentheses may be omitted:

`$a:add($b):toString`

A comprehensive set of [built-in JSON-fx functions](https://github.com/mindsung/json-fx/tree/develop/json-fx/src/fx/functions) provides the core functionality, exposing and extending many of the useful JavaScript methods. Additionally, extension functions and operators can be injected to extend the language by passing an array of definitions to the `JsonFx` class constructor.

#### Extension functions

A function definition is an object with two properties, ``name``
and ``evaluate``. The ``name`` property is the function name that will be used in expressions,
and the ``evaluate`` property is a JavaScript function definition. (JSON-fx function definitions may also include an
``operator`` property, see JSON-fx source for examples. Custom extension functions will not typically include
operator definitions, as most commonly-used operator symbols are already in use by built-in functions.)
```ts
const fx = new JsonFx([
  {
    name: "addFive",
    evaluate: n => n + 5
  }
]);
```

#### Value literals

String expressions may contain value literals, including numbers, strings, and booleans. Numeric literals
don't require any special notation. String literals must be contained within single quotes (``'``). Boolean
values may be ``true`` or ``false``. Additionally, the special values ``null`` and ``undefined`` may be used.

Array literals may also be embedded in string expressions using opening/closing square brackets ``[]``.

```ts
const template = "(1.5 + 3):toString + ['hello', 2, true, null]:first";
```
Yields the value ``"4.5hello"`` when evaluated against any input (the expression includes no input variables).


#### Property accessor dot notation

As in JavaScript and many other programming languages, dot notation is used in string expressions to access
object properties.

```ts
const compiled = fx.compile("$.someProp.someDeeperProp");
const output = compiled.evaluate({
  name: "$",
  value: {
    someProp: {
      someDeeperProp: "hello"
    }
  }
});
```
Yields the output ``"hello"``

#### The null-conditional operator

JSON-fx defines a built-in null-conditional operator that allows many templates to be simpler and more readable,
and avoid using frequent, verbose conditional logic for null checking and handling. The null-conditional
operator ``?`` may be used inline preceding any property dot accessor or function call. If the value of the
expression immediately preceding the ``?`` symbol is null or undefined, the expression will return null.

```ts
const template = "$.someProp?.someMissingProp?:substr(0, 3)?:toUpperCase";
```
When evaluated against any input ``$``, if the input value does not include a property ``someProp`` or
a property ``someProp.someMissingProp``, the expression will happily return a value of null rather
than throwing a runtime error. This behavior can be especially useful when input objects can be expected
to have varying structures or optional properties.

#### Anonymous (lambda) functions

Some functions require arguments that are expected to themselves be functions, such as an array ``find`` function,
which expects an argument that is a predicate function, and finds the first member of the array matching a
condition checked by the specified function. When calling such functions, the function-type arguments
may be expressed using an anonymous function, or lambda, syntax.

Consistent with many programming languages, JSON-fx lambda syntax consists of one or more function argument
variables, which must begin with ``"$"``, followed by ``=>``, followed by an expression. If more than one
argument is declared, the comma-separated argument list must be enclosed in parentheses. When only one
argument is declared, the parentheses are optional.

```ts
const template = "[2, 4, 6, 8]:find(($n) => $n > 5)"
```
Yields the value ``6`` when evaluated against any input.

### Object expressions

JSON-fx object expressions provide a powerful means by which objects of virtually any complexity may be
transformed and queried. An object expression is a JavaScript object that includes properties representing some combination
of JSON-fx variable declarations, JSON-fx runtime user-defined function declarations,
and outputs. The value of each property on the object may be a constant (single value, object, or array),
a JSON-fx string expression, or another JSON-fx object expression.

All properties on the object, except for those with the special notations discussed below, will also
be present on the resulting output value.

```ts
const compiled = fx.compile({
  someProp: "$ + 1",
  anotherProp: {
    deeperProp: "$ * 2"
  }
});
const output = compiled.evaluate({ name: "$", value: 5 });
```
Yields the output value ``{ someProp: 6, anotherProp: { deeperProp: 10 } }``

#### Variables

In addition to the named input variables passed into a template evaluation, local variables may be declared
as well. Variables in object expressions are properties beginning with the symbol ``"$"``, and may be used anywhere
in subsequent expressions. The value assigned to a variable property may be any constant or
expression value.

```ts
const template = {
  "$pi": 3.14159,
  "$radiusSquared": "$radius * $radius",
  radius: "$radius",
  area: "($pi * $radiusSquared * 100):math~round / 100" // round to 2 decimal places
};
```
When evaluated with an input ``$radius`` of value ``3`` will yield ``{ radius: 3, area: 28.27 }``

#### Runtime user-defined functions

While similar in behavior to extension and built-in functions, runtime user-defined functions are declared and
implemented within the expression templates. This allows the capabilities of your templates to be extended
even further without rebuilding and redeploying your application, and also provides a more compact and
efficient way to reuse expression logic within your template.

Runtime user-defined functions in object expressions are properties beginning with the symbol ``"@"``, and may
be used anywhere in subsequent expressions. The value assigned to the property may technically be any
constant or expression value, although only an expression value would make the function useful as opposed to
a variable. Similarly,
while function arguments aren't strictly required, a function without arguments would serve no advantage over
simply declaring a variable instead. Function arguments, as with all JSON-fx variables, must begin with ``"$"``.

```ts
const template = {
  "@rectArea($length, $width)": "$length * $width",
  area: "@rectArea($.length, $.width)"
};
```
When evaluated with an input ``$`` of value ``{ length: 3, width: 4 }`` will yield ``{ area: 12 }``.

Note that, as shown in the example above, when calling runtime user-defined functions, the function name
must include the beginning ``"@"`` symbol.

User-defined functions may also be used, instead of lambda functions, as arguments to functions that
expect function-type arguments. In this case, the function name, including ``@``, is passed as the argument
value.

```ts
const template = {
  "@isBigNumber($n)": "$n >= 100",
  "$numbers": [50, 75, 100, 200],
  firstBigNumber: "$numbers:find(@isBigNumber)"
};
```
Yields the value ``{ firstBigNumber: 100 }`` when evaluated against any input.

#### Variable and user-defined function scope

The scope of any variable or user-defined function within an object expression is the object in which it
is declared, including any number of levels of nested objects. Because templates are compiled before they
are evaluated, the actual order of properties is not significant. In other words, so long as it is in the same
(or nested) object scope, it is not necessary that the property declaring a variable or user-defined
function appear before it is used (although it will often improve readability).

```ts
const template = {
  rectInfo: {
    // @rectArea is in scope here because it was declared in an object containing this one.
    area: "@rectArea($.length, $.width)"
  },
  // valid to declare @rectArea here, even though it is used above this in the
  // logical property order.
  "@rectArea($length, $width)": "$length * $width"
};
```

#### Object value promotion

In addition to variable ``"$"`` and user-defined function ``"@"`` notation, a property name of `"()"` (empty parantheses) promotes that property to act as the value of its parent, thus ignoring all other properties defined on the object. Value promotion is
useful when a single output value is required, but it is necessary or helpful to arrive at the value by
using a more complex object expression, so that variables and/or user-defined functions may be
used.

```ts
const template = {
  "$pi": 3.14159,
  "@area($radius)": "$pi * $radius:pow(2)",
  "()": "@area($)"
};
```

When the above template is evaluated with input `$ = 3`, the result is simply `28.27431` (not an object).
Value promotion may be used in any nested level of object expressions, not just at the top level of the
template object.

Note that when using value promotion notation, the ``"()"`` property must be the only property, aside from
variable and user-defined function declarations, on the object. Other normal object properties present will result in a compile-time error.
