import { FxTokenRule } from "../model/fx-token-rule";

export const TokenRules: ReadonlyArray<FxTokenRule> = [
  {
    tag: "identifier",
    test: c => {
      const code = c.charCodeAt(0);
      return code >= 65 && code <= 90 || code >= 97 && code <= 122 // A - Z, a - z
        || c == "~" || c == "_";
    },
    mergeWith: ["variable", "template"]
  },
  {
    tag: "variable",
    test: c => c == "$"
  },
  {
    tag: "space",
    test: c => /\s/.test(c)
  },
  {
    tag: "group",
    test: c => c == "(" || c == "[" || c == "{",
    preventMerge: true
  },
  {
    tag: "group-close",
    test: c => c == ")" || c == "]" || c == "}",
    preventMerge: true
  },
  {
    tag: "template",
    test: c => c == "@"
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
    tag: "operator",
    test: c => c == ".",
    mergeWith: "numeric"
  },
  {
    tag: "operator",
    test: c => c == "-",
    preventMerge: true
  },
  {
    tag: "operator",
    test: () => true,
  }
];
