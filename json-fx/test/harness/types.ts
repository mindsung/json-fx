/**
 * Conformance corpus case format (V1-PLAN.md §9). Language-agnostic JSON so other engines can reuse the corpus.
 *
 * JSON can't express `undefined`, functions or class instances, so two sentinels are decoded by the runner in
 * `inputs`, `expect` and `v0Actual`:
 *   { "$$undefined": true }        -> undefined
 *   { "$$fixture": "<name>" }      -> a fresh value built by test/harness/fixtures.ts (host callbacks, class instances, ...)
 */

export interface ExpectedError {
  /** Error class name (FxSyntaxError | FxCompileError | FxRuntimeError). Only checked by engines with `strictErrors`. */
  type?: string;
  /** Case-insensitive substring of the error message. */
  match?: string;
  /** Whether the error is thrown by compile() or by evaluation. Only checked by engines with `strictErrors`. */
  phase?: "compile" | "run";
}

/** One evaluation of a compiled template. A case without `runs` is a single run described by the case itself. */
export interface ConformanceRun {
  inputs?: Record<string, unknown>;
  /** Expected output. Absent together with `expectError` is invalid. */
  expect?: unknown;
  expectError?: ExpectedError;
  /** Expected invocation counts of the call-counting test functions during this run (see fixtures.ts). */
  expectCalls?: Record<string, number>;

  /** What v0 is known to do for this run (only for `v0: "differs"`); verified by the runner so the claim can't rot. */
  v0Actual?: unknown;
  v0ActualError?: string;
  v0ActualCalls?: Record<string, number>;
}

export interface ConformanceCase extends ConformanceRun {
  /** Unique across the whole corpus. */
  name: string;
  /** Any JSON template; a string is a single expression. */
  template: unknown;
  /** Names of test extension functions (fixtures.ts) to register. */
  functions?: string[];
  /** Compile options (v1 only). A case that sets options must be `v0: "skip"`. */
  options?: { inputs?: string[]; strictIdentifiers?: boolean };
  runs?: ConformanceRun[];
  tags?: string[];

  /**
   * How v0 relates to the expectation:
   *  same    v0 must produce exactly `expect` / `expectError`
   *  differs v0 must NOT (known bug or accepted change) — requires `bug` or `note`
   *  skip    not runnable on v0 (new v1 feature/option)
   */
  v0: "same" | "differs" | "skip";
  /** Change class from V1-PLAN.md §7.1 for `differs` cases: A (v0 threw/unusable), B (bug fix), C (accepted semantic change). */
  change?: "A" | "B" | "C";
  /** Plan finding id(s), e.g. "B3". */
  bug?: string;
  note?: string;
  /** Where the case came from (spec file, README section, plan section). */
  source?: string;
}

export interface CorpusFile {
  /** Fields merged under every case in the file (shallow; the case wins). */
  defaults?: Partial<ConformanceCase>;
  cases: ConformanceCase[];
}
