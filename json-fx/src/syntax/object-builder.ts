import type { SourceRef } from "../api/types";
import { FxCompileError } from "../errors";
import type { Decl, Field, Node, ObjectNode, Param } from "./ast";

/** One key/value pair of an object template or object literal, after the key has been interpreted (V1-PLAN.md §5.4). */
export type ObjectEntry =
  | { kind: "var"; name: string; value: Node; src: SourceRef }
  | { kind: "fn"; name: string; params: Param[]; body: Node; src: SourceRef }
  | { kind: "output"; value: Node; src: SourceRef }
  | { kind: "static"; key: string; optional: boolean; value: Node; src: SourceRef }
  | { kind: "dynamic"; source: Node; valueName?: string; keyName?: string; value: Node; src: SourceRef };

/** Sorts entries into declarations, fields and the optional `()` output. Shared by the template reader and the object-literal parser. */
export function buildObject(entries: readonly ObjectEntry[], src: SourceRef): ObjectNode {
  const decls: Decl[] = [];
  const fields: Field[] = [];
  let output: Node | undefined;
  let outputSrc: SourceRef | undefined;

  for (const e of entries) {
    switch (e.kind) {
      case "var": decls.push({ kind: "var", name: e.name, value: e.value, src: e.src }); break;
      case "fn": decls.push({ kind: "fn", name: e.name, params: e.params, body: e.body, src: e.src }); break;
      case "static": fields.push({ kind: "static", key: e.key, value: e.value, optional: e.optional, src: e.src }); break;
      case "dynamic": {
        const f: Field = { kind: "dynamic", source: e.source, value: e.value, src: e.src,
          ...(e.valueName !== undefined ? { valueName: e.valueName } : {}),
          ...(e.keyName !== undefined ? { keyName: e.keyName } : {}) };
        fields.push(f);
        break;
      }
      case "output":
        if (output) { throw new FxCompileError("An object can have only one '()' output", e.src); }
        output = e.value;
        outputSrc = e.src;
        break;
    }
  }

  if (output && fields.length) {
    throw new FxCompileError("An object with a '()' output can only contain variable and function declarations", outputSrc);
  }
  return output ? { kind: "object", decls, fields, output, src } : { kind: "object", decls, fields, src };
}
