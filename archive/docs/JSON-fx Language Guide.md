# JSON-fx Language Guide

- [Functions](#functions)
  * [Overview](#overview)
  * [Invocation](#invocation)
    + [Multi-Argument Functions](#multi-argument-functions)
    + [Chaining](#chaining)

## Functions

### Overview

JSON-fx includes useful library functions for object/array manipulation, strings, math, and many others. The following example demonstrates function calls to `sin($theta)` and `cos($theta)`:

```json
{
    "$angle": "<< $PI >>",

    "sin": "<< sin($angle) >>",
    "cos": "<< cos($angle) >>"
}
```
> JSON Output
> ```json
> {
>     "sin": 0,
>     "cos": -1
> }
> ```

The variable `$angle` is provided to both `sin` and `cos`. The function call syntax is familiar to other programming languages, with comma-separated arguments encapsulated by parentheses.

```json
{
    "$vector": { "x": 6, "y": 8 },
    "length": "<< sqrt(pow($vector.x, 2) + pow($vector.y, 2)) >>"    
}
```
> JSON Output
> ```json
> {
>     "length": 10,
> }
> ```

<br/>

### Invocation

JSON-fx defines an invocation operator `::`, which invokes a function on its left operand. Here's an updated prior example with `sin` and `cos` that includes the invocation operator:

```json
{
    "$angle": 180.0,
    
    "sin": "<< sin(radians($angle)) >>",
    "cos": "<< cos($angle::radians()) >>"
}
```
> JSON Output
> ```json
> {
>     "sin": 0,
>     "cos": -1
> }
> ```

In this example, the value of `$angle` has changed to *180.0*, now representing degrees instead of radians. The math functions `sin` and `cos` operate in radians, so `$angle` is converted back to radians with the library function `radians($deg)`.

*Line 4* demonstrates a typical nested function call, where `$angle` is converted to radians and then passed to `sin`. *Line 5* includes the invocation operator `::` which passes `$angle` to the function `radians`. The two approaches, `radians($angle)` and `$angle:radians()` are functionally equivalent, but using the invocation operator can make some expressions easier to read.

#### Multi-Argument Functions

The invocation operator can also be used with multi-argument functions. Consider this example, where the library function `pow($a, $b)` raises `$a` to the power of `$b`:

```json
{
    "$vector": { "x": 6, "y": 8 },
    "length": "<< sqrt($vector.x::pow(2) + $vector.y::pow(2)) >>"
}
```

> JSON Output
> ```json
> {
>     "length": 10,
> }
> ```

<br/>

The left operands, `$vector.x` and `$vector.y`, are passed as the *first* parameter to the right operand functions `pow($a, $b)`, and thus are equivalent to `pow($vector.x, 2)` and `pow($vector.y, 2)` respectively.

#### Chaining

Multiple invocation operators can be chained together to form complex expressions. This example shows a chain of invocation operators which verify an email address domain.

```json
{
    "$email": "  johnsmith@FxMail.com  ",
    "is-fxmail": "<< $email::trim()::lowercase()::endswith('fxmail.com') >>"
}
```
> JSON Output
> ```json
> {
>     "is-fxmail": true
> }
> ```

The value of `$email` is trimmed of whitespace, then converted to lowercase, then checked for whether it ends with *"fxmail.com"*. This chain of invocation operators is equivalent to the nested function calls `endswith(lowercase(trim($email)))`.

<br/>

> The invocation operator aims to improve code clarity and emulate the behavior of object-oriented member functions. Its left operand can be perceived as a *this* pointer (or *self* in Python). Most library functions are designed to take advantage of invocation by placing the contextual argument first. For example, the function `endswith($string, $suffix)` places the contextual `$string` first such that it reads `$string:endswith($suffix)` upon invocation.
