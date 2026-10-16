export interface BenchFixture {
  name: string;
  description: string;
  /** Template compiled by each engine; evaluated with the single input `$`. */
  template: unknown;
  /** Deterministic input number `k` (the runner cycles through `inputCount` of them). */
  makeInput(k: number): unknown;
  /** Hand-written JS equivalent: the reference for output equality and the performance floor. */
  handWritten(input: any): unknown;
  /** Engines whose output is known to differ from the reference (e.g. v0's recursion bug B2). */
  knownMismatch?: Record<string, string>;
}
