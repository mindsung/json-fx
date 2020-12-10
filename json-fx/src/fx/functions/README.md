# JSON-fx built-in function reference

## Arithmetic

### ``add(a, b)`` operator ``+``
Add two numbers, or concatenate two strings
***
### ``sub(a, b)`` operator ``-``
Subtract two numbers
***
### ``mul(a, b)`` operator ``*``
Multiply two numbers
***
###  ``div(a, b)`` operator ``/``
Divide two numbers
***
### ``mod(a, b)`` operator ``%``
Return the remainder after integer division
***
### ``pow(a, b)`` operator ``**``
Return the result of raising the first number to the power of the second (exponentiation)
***
### ``neg(a)`` operator ``-``a
Negates the numeric input value
***

## Comparative

### ``eq(a, b)`` operator ``==``
Returns boolean value indicating equality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality))
***
### ``eqq(a, b)`` operator ``===``
Returns boolean value indicating strict equality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality))
***
### ``neq(a, b)`` operator ``!=``
Returns boolean value indicating inequality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality))
***
### ``neqq(a, b)`` operator ``!==``
Returns boolean value indicating strict inequality of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_inequality))
***
### ``gt(a, b)`` operator ``>``
Returns boolean value indicating first value is greater than the second
***
### ``gte(a, b)`` operator ``>=``
Returns boolean value indicating first value is greater than or equal to the second
***
### ``lt(a, b)`` operator ``<``
Returns boolean value indicating first value is less than the second
***
### ``lte(a, b)`` operator ``<=``
Returns boolean value indicating first value is less than or equal to the second
***

## Logical

### ``or(a, b)`` operator ``||``
Logical OR of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR))
***
### ``and(a, b)`` operator ``&&``
Logical AND of two values
([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND))
***
### ``not(a)`` operator ``!``
Logical NOT ([JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT))
***

## Conditional

### ``ifElse(condExpr, thenExpr, elseExpr)``
Evaluates the condition expression, returns the value of thenExpr expression if true, otherwise the value of elseExpr expression
***
### ```ifNull(

## Strings

TODO

## Arrays

TODO

## Date / time

TODO

## JavaScript ``Math``

JSON-fx additionally exposes the entire set of JavaScript ``Math`` static functions and constants.

[See the JavaScript reference for a list of all included math functions and constants](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)

These functions are accessed in JSON-fx using the JavaScript function and constant names, preceded
by ``math~``, for example ``math~round(12.34)``, ``math~PI``.
