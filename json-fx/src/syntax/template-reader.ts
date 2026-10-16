import type { FunctionRegistry } from "../api/registry";
import type { SourceRef } from "../api/types";
import { FxSyntaxError } from "../errors";
import type { Node } from "./ast";
import { buildObject, type ObjectEntry } from "./object-builder";
import { Parser, type ParseNoteSink } from "./parser";

const IDENTIFIER_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const keyPath = (path: string, key: string): string =>
  IDENTIFIER_KEY.test(key) ? (path ? `${path}.${key}` : key) : `${path}[${JSON.stringify(key)}]`;

/** The JSON-value → AST step (V1-PLAN.md §5.4). Pure syntax: nothing is resolved or evaluated. */
export class TemplateReader {
  private readonly parser: Parser;

  /** `sink` receives the v0-compatibility notes of `json-fx check` (see `ParseNote`). */
  constructor(registry: FunctionRegistry, sink?: ParseNoteSink) {
    this.parser = new Parser(registry, sink);
  }

  public read(template: unknown): Node {
    return this.readValue(template, "");
  }

  private readValue(value: unknown, path: string): Node {
    const src: SourceRef = { path, line: 0, column: 0, symbol: "" };

    if (typeof value === "string") {
      // An empty expression is null (v0).
      return value.trim() === "" ? { kind: "literal", value: null, src } : this.parser.parseExpression(value, path);
    }
    if (value === null || typeof value === "number" || typeof value === "boolean") {
      return { kind: "literal", value, src };
    }
    if (Array.isArray(value)) {
      return { kind: "array", items: value.map((item, i) => this.readValue(item, `${path}[${i}]`)), src };
    }
    if (typeof value === "object") {
      return this.readObject(value as Record<string, unknown>, path, src);
    }
    throw new FxSyntaxError(`Unsupported template value of type ${typeof value}`, src);
  }

  private readObject(obj: Record<string, unknown>, path: string, src: SourceRef): Node {
    const entries: ObjectEntry[] = [];

    for (const key of Object.keys(obj)) {
      if (key.startsWith("//")) { continue; }

      const value = obj[key];
      const keySrc: SourceRef = { path: keyPath(path, key), line: 0, column: 0, symbol: key };
      const valuePath = keyPath(path, key);

      if (key === "()") {
        entries.push({ kind: "output", value: this.readValue(value, valuePath), src: keySrc });
      } else if (key.startsWith("$")) {
        entries.push({ kind: "var", name: this.parser.parseVarKey(key, valuePath), value: this.readValue(value, valuePath), src: keySrc });
      } else if (key.startsWith("@")) {
        const decl = this.parser.parseFnKey(key, valuePath);
        entries.push({ kind: "fn", name: decl.name, params: decl.params, body: this.readValue(value, valuePath), src: keySrc });
      } else if (key.startsWith("{") && key.endsWith("}")) {
        const dyn = this.parser.parseDynamicKey(key.slice(1, -1), valuePath);
        entries.push({ kind: "dynamic", ...dyn, value: this.readValue(value, valuePath), src: keySrc });
      } else if (key.endsWith("?")) {
        entries.push({ kind: "static", key: key.slice(0, -1), optional: true, value: this.readValue(value, valuePath), src: keySrc });
      } else {
        entries.push({ kind: "static", key, optional: false, value: this.readValue(value, valuePath), src: keySrc });
      }
    }
    return buildObject(entries, src);
  }
}
