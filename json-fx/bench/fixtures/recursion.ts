import type { BenchFixture } from "./types";

// Module-level: see the note in order.ts about keepNames.
function fib(x: number): number { return x < 2 ? x : fib(x - 1) + fib(x - 2); }

export const recursion: BenchFixture = {
  name: "recursion",
  description: "recursive user function (fibonacci)",
  template: { "@fib($n)": "ifElse($n < 2, $n, @fib($n - 1) + @fib($n - 2))", "()": "@fib($)" },
  makeInput: (k) => 8 + (k % 5),
  handWritten: (n) => fib(n as number),
  knownMismatch: { v0: "B2: user functions are not re-entrant in v0, so recursion returns wrong values" }
};
