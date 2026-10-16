/**
 * One-line descriptions of the built-in functions, the source of the function reference in docs/FUNCTIONS.md
 * (`npm run docs`). Kept apart from the definitions so it is never part of the runtime bundle. A test fails when a
 * built-in has no entry here, so a new function can't ship undocumented. `math~*` functions are described by the
 * generator (each is the `Math` function of the same name).
 */
export interface FunctionDoc {
  readonly summary: string;
  /** A short example: `expression` → result. */
  readonly example?: string;
  /** Parameters (by name in `evaluate`) shown as optional. */
  readonly optional?: readonly string[];
}

const d = (summary: string, example?: string, ...optional: string[]): FunctionDoc => ({ summary, example, optional });

export const functionDocs: Readonly<Record<string, FunctionDoc>> = {
  // arithmetic (operators)
  add: d("Adds numbers or concatenates strings (`+`).", "1 + 2 → 3"),
  sub: d("Subtracts (`-`).", "5 - 2 → 3"),
  mul: d("Multiplies (`*`).", "2 * 3 → 6"),
  div: d("Divides (`/`).", "7 / 2 → 3.5"),
  mod: d("Remainder (`%`).", "7 % 4 → 3"),
  pow: d("Exponentiation (`**`, right-associative).", "2 ** 3 → 8"),
  neg: d("Unary minus; applies to the whole chain that follows it.", "-$.x"),

  // comparative (operators)
  eq: d("Loose equality (`==`).", "1 == '1' → true"),
  eqq: d("Strict equality (`===`).", "1 === '1' → false"),
  neq: d("Loose inequality (`!=`)."),
  neqq: d("Strict inequality (`!==`)."),
  gt: d("Greater than (`>`)."),
  gte: d("Greater than or equal (`>=`)."),
  lt: d("Less than (`<`)."),
  lte: d("Less than or equal (`<=`)."),

  // logical (operators)
  or: d("Short-circuit or (`||`); returns the deciding operand, not a boolean.", "'x' || 'y' → 'x'"),
  and: d("Short-circuit and (`&&`); returns the deciding operand, not a boolean.", "$.a && $.a.b"),
  not: d("Logical not (`!`); applies to the whole chain that follows it.", "!$.active"),
  notNot: d("Converts to boolean (`!!`).", "!!$.name"),

  // conditional
  ifElse: d("Evaluates only the chosen branch. Also written `A if C else B`.", "ifElse($.age >= 18, 'adult', 'minor')"),
  ifNull: d("`valIfNull` if the value is `null`; otherwise `valIfNotNull`, or the value itself when that is omitted.", "ifNull($.x, 0)", "valIfNotNull"),
  ifUndefined: d("Like `ifNull`, for `undefined`.", undefined, "valIfNotNull"),
  ifNullOrUndefined: d("Like `ifNull`, for `null` or `undefined`.", "ifNullOrUndefined($.x, 'n/a')", "valIfNotNull"),

  // collection
  assign: d("Merges the own properties of its arguments into a new object (later arguments win; `null` arguments are skipped).", "assign($.a, $.b)"),
  map: d("Array of `lambda(item, index)` for each item.", "$.items:map($i => $i * 2)"),
  sort: d("Sorted copy; stable. With a key lambda the keys are computed once per item; without one, JavaScript's default (string) order.", "$.people:sort($p => $p.age)", "lambda"),
  reverse: d("Reversed copy.", "[1, 2, 3]:reverse → [3, 2, 1]"),
  indexOf: d("Index of the first item equal (`===`) to the value, or -1; `undefined` if the first argument is not an array."),
  findIndex: d("Index of the first item for which the lambda is truthy, or -1.", "$.items:findIndex($i => $i.id == 5)"),
  filter: d("Array: the items for which `lambda(item, index)` is truthy. Object: the entries for which `lambda(key, value)` is truthy.", "$.items:filter($i => $i.active)"),
  reduce: d("Folds the array with `lambda(accumulator, item, index)`, starting from `identity`.", "$.n:reduce(($a, $b) => $a + $b, 0)"),
  find: d("The first item for which the lambda is truthy, or `undefined`.", "$.items:find($i => $i.id == 5)"),
  slice: d("Copy of the items from `startIndex` up to (not including) `stopIndex`.", "[1, 2, 3, 4]:slice(1, 3) → [2, 3]", "stopIndex"),
  splice: d("Copy with `deleteCount` items removed at `startIndex` and the extra arguments inserted there. Never changes the original."),
  concat: d("One array of the arguments: array arguments are spread, other values appended, `null` arguments skipped.", "concat($.a, $.b, 5)"),
  min: d("Smallest value (of the key lambda's results), ignoring `null`; `null` for an empty array.", "$.prices:min", "lambda"),
  findMin: d("The item with the smallest key (the value itself without a lambda).", "$.items:findMin($i => $i.price)", "lambda"),
  max: d("Largest value (of the key lambda's results), ignoring `null`; `null` for an empty array.", "$.prices:max", "lambda"),
  findMax: d("The item with the largest key (the value itself without a lambda).", "$.items:findMax($i => $i.price)", "lambda"),
  avg: d("Average of the numeric values (of the key lambda's results); `null` values are skipped, non-numbers throw, `null` when there are none.", "$.scores:avg", "lambda"),
  length: d("Number of items (or characters in a string).", "$.items:length"),
  range: d("Numbers from `min` up to (not including) `max`, stepping by `incr` (default 1).", "range(0, 5) → [0, 1, 2, 3, 4]", "incr"),
  item: d("The item at the index (a safe, hardened read).", "$.items:item(2)"),
  first: d("The first item, or `undefined` for an empty or missing array."),
  last: d("The last item, or `undefined` for an empty or missing array."),

  // string
  toString: d("Converts to a string.", "(1.5 + 3):toString → '4.5'"),
  substr: d("Substring from `startIndex` of `length` characters.", "'hello':substr(1, 3) → 'ell'"),
  substring: d("Substring from `startIndex` up to (not including) `stopIndex`.", "'hello':substring(1, 3) → 'el'", "stopIndex"),
  startsWith: d("Whether the string starts with `test`."),
  endsWith: d("Whether the string ends with `test`."),
  contains: d("Whether the string contains `test`."),
  split: d("Splits the string at every `separator`.", "'a,b':split(',') → ['a', 'b']"),
  join: d("Joins the items with `separator`.", "['a', 'b']:join('-') → 'a-b'"),
  toUpperCase: d("Upper case."),
  toLowerCase: d("Lower case."),
  toTitleCase: d("Capitalizes each space-separated word.", "'hello world':toTitleCase → 'Hello World'"),
  toSnakeCase: d("Joins the space-separated words with `_`.", "'hello world':toSnakeCase → 'hello_world'"),
  toCamelCase: d("Camel case from words separated by spaces or punctuation, or by a change of case.", "'hello_big world':toCamelCase → 'helloBigWorld'"),
  trim: d("Removes leading and trailing whitespace."),
  trimLeft: d("Removes leading whitespace."),
  trimRight: d("Removes trailing whitespace."),
  replace: d("Replaces every occurrence of `orig` with `repl` (nothing if omitted).", "'a-b-c':replace('-', '+') → 'a+b+c'", "repl"),

  // time
  now: d("The current date and time (a `Date`). Not pure."),
  dateTime: d("A `Date` from a string, a timestamp or another `Date`.", "dateTime('2020-01-02T03:04:05Z')"),
  toISODateTime: d("ISO 8601 UTC string (`YYYY-MM-DDTHH:mm:ss.sssZ`).", "toISODateTime('2020-01-02') → '2020-01-02T00:00:00.000Z'"),
  toISOLocalDateTime: d("ISO 8601 string with a UTC offset. `offsetMinutes` follows `Date.getTimezoneOffset()` (minutes *west* of UTC, so -60 is `+01:00`); by default the host's offset at that date.", "toISOLocalDateTime($.t, 0)", "offsetMinutes"),

  // misc & errors
  log: d("Writes `desc` and the value to the console and returns the value. Not pure.", "log('total', $.total)"),
  notNull: d("The value, or an error `Value cannot be null.` if it is `null` or `undefined`.", "$.id:notNull"),
  throw: d("Throws an error with the message (evaluated lazily).", "throw('missing id')"),
  catch: d("The value, or `catchValue` (default `null`) if evaluating it throws. Both are evaluated lazily.", "$.a.b.c:catch('n/a')", "catchValue")
};
