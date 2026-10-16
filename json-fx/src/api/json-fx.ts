import { checkTemplate, type CheckOptions, type CheckReport } from "../check/check";
import { compileClosure } from "../backend/closure/compile";
import { canGenerate, compileCodegen, type TemplateFn } from "../backend/js/codegen";
import { FxCompileError, FxError } from "../errors";
import { optimize } from "../semantics/optimize";
import { resolve, type BareWord, type FxWarning } from "../semantics/resolve";
import { asExtension, createRegistry } from "../stdlib";
import { TemplateReader } from "../syntax/template-reader";
import { wrap } from "../runtime/helpers";
import type { FunctionRegistry } from "./registry";
import type { CompileOptions, FxFunctionDef, FxInput } from "./types";

export interface JsonFxOptions {
  /** Extension functions (each array is one definition set), registered after the built-ins. */
  functions?: ReadonlyArray<ReadonlyArray<FxFunctionDef>>;
  /** `auto` uses the code generator when `new Function` works and falls back to the closure backend. */
  backend?: "auto" | "codegen" | "closure";
  /** Constant folding, literal-variable inlining and removal of unused declarations (default `true`). */
  optimize?: boolean;
}

export interface FxCompiledTemplate {
  /** Pure fast path: `compiled.run({ $: data })`. Nothing is retained between calls. */
  run(inputs: Record<string, unknown>): any;
  /** v0-compatible: inputs persist across calls (merged into a retained object) until `clearInputs()`. */
  evaluate(...inputs: FxInput[]): any;
  clearInputs(): void;
  /** Non-fatal findings from compilation. */
  readonly warnings: readonly FxWarning[];
  /** Identifiers that were compiled as string constants. */
  readonly bareWords: readonly BareWord[];
  /** Generated JS (codegen backend only), for debugging. */
  readonly source?: string;
  toString(): string;
}

const isOptions = (v: unknown): v is JsonFxOptions => v !== null && typeof v === "object" && !Array.isArray(v);

export class JsonFx {
  private readonly registry: FunctionRegistry;
  private readonly globals = new Map<string, unknown>();
  private readonly backend: NonNullable<JsonFxOptions["backend"]>;
  private readonly optimizeByDefault: boolean;

  constructor(options?: JsonFxOptions);
  /** v0-compatible: one or more arrays of extension functions. */
  constructor(...definitionSets: ReadonlyArray<FxFunctionDef>[]);
  constructor(...args: unknown[]) {
    const first = args[0];
    const options: JsonFxOptions = args.length === 1 && isOptions(first) ? first : {};
    const sets = (args.length === 1 && isOptions(first) ? options.functions ?? [] : args) as ReadonlyArray<ReadonlyArray<FxFunctionDef>>;
    this.registry = createRegistry(...sets);
    this.backend = options.backend ?? "auto";
    this.optimizeByDefault = options.optimize ?? true;
  }

  /** Adds or replaces functions. Templates compiled earlier are not affected. */
  public define(def: FxFunctionDef | ReadonlyArray<FxFunctionDef>): void {
    for (const d of Array.isArray(def) ? def as ReadonlyArray<FxFunctionDef> : [def as FxFunctionDef]) { this.registry.define(asExtension(d)); }
  }

  /**
   * Defines `$name` for every template compiled afterwards. The name is bound at compile time but the value is read
   * from this instance on every run, so later updates are visible to templates that were already compiled.
   */
  public defineGlobal(name: `$${string}`, value: unknown): void {
    if (typeof name !== "string" || !/^\$[A-Za-z0-9_]*$/.test(name)) { throw new Error(`Invalid global name "${String(name)}": expected '$' followed by letters, digits or '_'`); }
    this.globals.set(name, value);
  }

  /**
   * Static analysis for `json-fx check`: compile errors with suggestions, constructs whose meaning differs from v0
   * (Class B/C, V1-PLAN.md §7.1), warnings and bare words. Never throws for a bad template.
   */
  public check(template: unknown, options: CheckOptions = {}): CheckReport {
    return checkTemplate(template, { registry: this.registry, isGlobal: (n) => this.globals.has(n), globalNames: () => this.globals.keys() }, options);
  }

  public compile(template: unknown, options: CompileOptions = {}): FxCompiledTemplate {
    const backend = options.backend ?? this.backend;
    if (backend === "codegen" && !canGenerate()) {
      throw new FxCompileError("The codegen backend needs `new Function`, which is not available here (strict CSP?); use 'closure' or 'auto'");
    }

    const read = new TemplateReader(this.registry).read(template);
    const resolveOptions = {
      ...(options.inputs ? { inputs: options.inputs } : {}),
      ...(options.strictIdentifiers ? { strictIdentifiers: true } : {}),
      isGlobal: (name: string) => this.globals.has(name),
      globalNames: () => this.globals.keys()
    };
    const { warnings, bareWords } = resolve(read, this.registry, resolveOptions);
    const ast = (options.optimize ?? this.optimizeByDefault) ? optimize(read, (tree) => { resolve(tree, this.registry, resolveOptions); }) : read;
    if (backend === "closure" || (backend === "auto" && !canGenerate())) {
      const body = compileClosure(ast);
      const globals = this.globals;
      return new CompiledTemplate((inputs) => body({ inputs, globals }), undefined, options.name, warnings, bareWords);
    }
    const js = compileCodegen(ast, this.globals, options.name);
    return new CompiledTemplate(js.run, js.source, options.name, warnings, bareWords);
  }
}

class CompiledTemplate implements FxCompiledTemplate {
  private retained: Record<string, unknown> = {};

  constructor(
    private readonly exec: TemplateFn,
    public readonly source: string | undefined,
    private readonly name: string | undefined,
    public readonly warnings: readonly FxWarning[],
    public readonly bareWords: readonly BareWord[]
  ) {}

  public run(inputs: Record<string, unknown>): any {
    try {
      return this.exec(inputs);
    } catch (e) {
      const error = e instanceof FxError ? e : wrap(e, { path: "", line: 0, column: 0, symbol: "" });
      if (this.name !== undefined && error.templateName === undefined) { error.templateName = this.name; }
      throw error;
    }
  }

  public evaluate(...inputs: FxInput[]): any {
    for (const input of inputs) { this.retained[input.name] = input.value; }
    return this.run(this.retained);
  }

  public clearInputs(): void {
    this.retained = {};
  }

  public toString(): string {
    return `[json-fx ${this.source === undefined ? "closure" : "codegen"} template${this.name !== undefined ? ` '${this.name}'` : ""}]`;
  }
}
