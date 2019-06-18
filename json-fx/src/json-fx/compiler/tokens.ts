import { FxTokenRule } from "./lex/fx-tokenizer";

export type FxTokenTag =
  | ""
  | "global"
  | "identifier"
  | "variable"
  | "numeric"
  | "group"
  | "group-close"
  | "literal"
  | "delimiter"
  | "space"
  | "template"
  | "template-call"
  | "array"
  | "operator"
  | "expression"
  | "object"
  | "lambda";

export namespace JsonFx.token {
  export const literalSymbol = "`";

  export const rules: ReadonlyArray<FxTokenRule> = [
    {
      tag: "identifier",
      test: c => {
        const code = c.charCodeAt(0);
        return code >= 65 && code <= 90 || code >= 97 && code <= 122 // A - Z, a - z
          || c === "~" || c === "_";
      },
      mergeWith: ["variable", "template"]
    },
    {
      tag: "numeric",
      test: c => {
        const code = c.charCodeAt(0);
        return code >= 48 && code <= 57; // 0 - 9
      },
      mergeWith: ["identifier", "variable", "template"]
    },
    {
      tag: "variable",
      test: c => c === "$"
    },
    {
      tag: "template",
      test: c => c === "@"
    },
    {
      tag: "group",
      test: c => c === "(" || c === "[" || c === "{",
      preventMerge: true
    },
    {
      tag: "group-close",
      test: c => c === ")" || c === "]" || c === "}",
      preventMerge: true
    },
    {
      tag: "space",
      test: c => /\s/.test(c)
    },
    {
      tag: "operator",
      test: c => c === ".",
      mergeWith: "numeric"
    },
    {
      tag: "operator",
      test: () => true,
    }
  ];
}
