# JSON-fx built-in function reference

## Arithmetic

#### `add(a, b)` operator `+`
Add two numbers, or concatenate two strings
***
#### `sub(a, b)` operator `-`
Subtract two numbers
***
#### `mul(a, b)` operator `*`
Multiply two numbers
***
####  `div(a, b)` operator `/`
Divide two numbers
***
#### `mod(a, b)` operator `%`
Return the remainder after integer division
***
#### `pow(a, b)` operator `**`
Return the result of raising the first number to the power of the second (exponentiation)
***
#### `neg(a)` operator `-`a
Negates the numeric input value
***

## Comparative

#### `eq(a, b)` operator `==`
Returns boolean value indicating equality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality))
***
#### `eqq(a, b)` operator `===`
Returns boolean value indicating strict equality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality))
***
#### `neq(a, b)` operator `!=`
Returns boolean value indicating inequality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality))
***
#### `neqq(a, b)` operator `!==`
Returns boolean value indicating strict inequality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_inequality))
***
#### `gt(a, b)` operator `>`
Returns boolean value indicating first value is greater than the second
***
#### `gte(a, b)` operator `>=`
Returns boolean value indicating first value is greater than or equal to the second
***
#### `lt(a, b)` operator `<`
Returns boolean value indicating first value is less than the second
***
#### `lte(a, b)` operator `<=`
Returns boolean value indicating first value is less than or equal to the second
***

## Logical

#### `or(a, b)` operator `||`
Logical OR of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR))
***
#### `and(a, b)` operator `&&`
Logical AND of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND))
***
#### `not(a)` operator `!`
Logical NOT ([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT))
***

## Conditional

#### `ifElse(condExpr, thenExpr, elseExpr)`
Evaluates the condition `expr`, returns the value of `thenExpr` expression if true, otherwise the value of `elseExpr` expression
***
#### `ifNull(expr, exprIfNull, exprIfNotNull)`
Returns the value of `exprIfNull` if `expr` evaluates to null, otherwise the value of `exprIfNotNull` if provided, otherwise the value of `expr`
****
#### `ifUndefined(expr, exprIfUndefined, exprIfNotUndefined)`
Returns the value of `exprIfUndefined` if `expr` evaluates to undefined, otherwise the value of `exprIfNotUndefined` if provided, otherwise the value of `expr`
****
#### `ifNullOrUndefined(expr, exprIfNullOrUndefined, exprIfNotNullOrUndefined)`
Returns the value of `exprIfNullOrUndefined` if `expr` evaluates to null or undefined, otherwise the value of `exprIfNotNullOrUndefined` if provided, otherwise the value of `expr`
****

## Strings

#### `toString(val)`
Returns a string representation of the input value
***
#### `substr(val, startIndex, length)`
Returns a sub-string of string `val`, beginning with `startIndex`, up to a length of `length`
****
#### `startsWith(val, findVal)`
Returns a boolean indicating whether the input string `val` starts with the string `findVal`
***
#### `endsWith(val, findVal)`
Returns a boolean indicating whether the input string `val` ends with the string `findVal`
***
#### `contains(val, findVal)`
Returns a boolean indicating whether the input string `val` contains the string `findVal`
***
#### `split(val, separator)`
Returns an array of strings created by splitting the input string `val` on any occurrences of
the string `separator`
***
#### `join(valArray, separator)`
Returns a single string created by joining the input array of strings `valArray`, separated by the
string `separator`
***
#### `toUpperCase(val)`
Returns a string converting all alphabetic characters in string `val` to upper case
***
#### `toLowerCase(val)`
Returns a string converting all alphabetic characters in string `val` to lower case
***
#### `toTitleCase(val)`
Returns a string with all whitespace-separated words in string `val` beginning with an upper case letter
and subsequent characters in each word converted to lower case, any words that are all upper case remain
all upper case (such as acronyms or initials)
***
#### `trim(val)`
Returns a string with any leading or trailing whitespace removed
***
#### `trimLeft(val)`
Returns a string with any leading whitespace removed
***
#### `trimRight(val)`
Returns a string with any trailing whitespace removed
***
#### `replace(val, findVal, replaceVal)`
Returns a string with all occurrences of `findVal` in string `val` replaced by string `replaceVal`

## Arrays

#### `map(array, mapFunction)`
Returns an array with each element of the input `array` mapped using the `mapFunction` function
***
#### `sort(array, sortFunction)`
Returns an array with all elements of the input `array` sorted according to the `sortFunction` if provided,
otherwise sorted by the element values (See the [JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
for information about sort functions)

*Note that while the native JavaScript sort function mutates the original array, the JSON-fx implementation
does not change the original input array
***
#### `reverse(array)`
Returns an array with all elements of the input `array` in reverse order

*Note that while the native JavaScript reverse function mutates the original array, the JSON-fx implementation
does not change the original input array
***
#### `indexOf(array, findVal)`
Returns the index of the first element in `array` found to be equal to the input `findVal`, if not found
returns -1
***
#### `findIndex(array, findFunction)`
Returns the index of the first element in `array` for which the result of evaluating `findFunction` against
the element returns a non-falsy value
***
#### `find(array, findFunction)`
Returns the first element in `array` for which the result of evaluating `findFunction` against
the element returns a non-falsy value
***
#### `filter(array, filterFunction)`
Returns an array containing all elements in `array` for which the result of evaluating `filterFunction'
against the element returns a non-falsy value
***
#### `reduce(array, reduceFunction, initVal)`
Returns a value as determined by passing all elements of input `array` into the reduce function, along
with an accumulator value, initialized as `initValue` (See the [JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
for a deeper explanation of the reduce function)
***
#### `slice(array, startIndex, stopIndex)`
Returns a portion of the input `array`, starting with the element at index `startIndex`, and up to
but not including the element at index `stopIndex`
***
#### `splice(array, startIndex, deleteCount, ...addItems)`
Returns an array created by deleting `deleteCount` number of elements (can be zero,
indicating that no elements will be removed) from the input `array`, starting
at `startIndex`, then inserting any number of additional elements into the array at that location

*Note that while the native JavaScript splice function mutates the original array, the JSON-fx implementation
does not change the original input array
***
#### `concat(array, otherArray)`
Returns an array created by concatenating `otherArray` to the end of the input `array`
***
#### `min(array, valueFunction)`
Returns the minimum value, as returned by the `valueFunction`, of all elements in the array, or if `valueFunction`
is not provided, returns the minimum element value
***
#### `findMin(array, valueFunction)`
Similar to the array `min()` function, but instead of returning the minimum value as returned by `valueFunction`,
returns the element in the array that resulted in that minimum value, useful for returning
the full object element of an array of objects that contains a minimum value as determined by `valueFunction`
***
#### `max(array, valueFunction)`
Returns the maximum value, as returned by the `valueFunction`, of all elements in the array, or if `valueFunction`
is not provided, returns the maximum element value
***
#### `findMax(array, valueFunction)`
Similar to the array `max()` function, but instead of returning the maximum value as returned by `valueFunction`,
returns the element in the array that resulted in that maximum value, useful for returning
the full object element of an array of objects that contains a maximum value as determined by `valueFunction`
***
#### `avg(array, valueFunction)`
Returns an average value of all elements in the input `array`, averaging values as returned by `valueFunction`,
or if `valueFunction` is not provided, uses the values of each element in the array
***
#### `length(array)`
Return the length of (number of elements in) the input `array`
***
#### `range(minNumber, maxNumber, increment)`
Generates and returns an array containing a range of numeric values beginning with `minNumber`, continuing
up to `maxNumber`, each value incrementing by `increment`
***
#### `item(array, index)`
Returns the item at element `index` in the input `array`

*Note that as with the JavaScript indexer notation (a value between opening and closing square brackets),
this function may also be used to return a property of an object, with the `index` argument indicating a
numeric or string key
***
#### `first(array)`
Returns the first element of the input `array`
***
#### `last(array)`
Returns the last element of the input `array`
***

## Date / time

#### `now()`
Returns a JavaScript Date object representing the system time at the time the function is called
***
#### `dateTime(initVal)`
Returns a JavaScript Date object initialized with the string `initVal` or with an integer `initVal`
representing a standard epoch millisecond timestamp value
***
#### `toISODateTime(val)`
Returns an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string representation of the input
date string or JavaScript Date object (previously created by calling `now()` or `dateTime(initVal)`)
in UTC form, e.g. `"2020-01-01T01:23:45.678Z"`
***
#### `toISOLocalDateTime(val, tzOffsetMinutes)`
Returns an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string representation of the input
date string or JavaScript Date object (previously created by calling `now()` or `dateTime(initVal)`)
in time zone offset form, e.g. `"2020-01-01T01:23:45.678-05:00"`, using `tzOffsetMinutes` as the timezone
offset in minutes if provided, otherwise using the current system configured time zone

*Note that because of the way JavaScript and the ISO 8601 standard interpret time zone offsets, if
providing a `tzOffsetMinutes` parameter to this function, this value will be of the opposite sign as
that seen in the resulting output string, for example while the standard EST time zone is 5 hours behind
GMT, displayed in ISO 8601 format as `"2020-01-01T01:23:45.678-05:00"`, the corresponding `tzOffsetMinutes`
parameter would be (positive) 300 minutes.

## JavaScript ``Math``

JSON-fx additionally exposes the entire set of JavaScript ``Math`` static functions and constants.

[See the JavaScript reference for a list of all included math functions and constants](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)

These functions are accessed in JSON-fx using the JavaScript function and constant names, preceded
by ``math~``, for example ``math~round(12.34)``, ``math~PI``.
