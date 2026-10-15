import type { FxFunctionDef } from "../api/types";

function simpleWordSplit(str: string): string[] {
  return str.split(" ").map(s => s.trim()).filter(s => !!s);
}

function connectedWordSplit(str: string): string[] {
  const words = [""];
  let lastChar: string | undefined;

  for (const char of str) {
    const isDelimiter = /[^a-zA-Z0-9]/.test(char);

    if (words[words.length - 1] && (isDelimiter || lastChar && (lastChar === lastChar.toLowerCase()) && (char === char.toUpperCase()))) {
      words.push("");
    }
    if (!isDelimiter) {
      words[words.length - 1] += char.toLowerCase();
    }
    lastChar = char;
  }
  return words.filter(w => !!w);
}

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

export const string: readonly FxFunctionDef[] = [
  { name: "toString", pure: true, evaluate: (val: any) => val.toString() },
  { name: "substr", pure: true, evaluate: (str: string, startIndex: number, length: number) => str.substr(startIndex, length) },
  { name: "substring", pure: true, evaluate: (str: string, startIndex: number, stopIndex: number) => str.substring(startIndex, stopIndex) },
  { name: "startsWith", pure: true, evaluate: (str: string, test: string) => str.startsWith(test) },
  { name: "endsWith", pure: true, evaluate: (str: string, test: string) => str.endsWith(test) },
  { name: "contains", pure: true, evaluate: (str: string, test: string) => str.indexOf(test) >= 0 },
  { name: "split", pure: true, evaluate: (str: string, separator: string) => str.split(separator) },
  { name: "join", pure: true, evaluate: (items: any[], separator: string) => items.join(separator) },
  { name: "toUpperCase", pure: true, evaluate: (str: string) => str.toUpperCase() },
  { name: "toLowerCase", pure: true, evaluate: (str: string) => str.toLowerCase() },
  { name: "toTitleCase", pure: true, evaluate: (str: string) => simpleWordSplit(str).map(capitalize).join(" ") },
  { name: "toSnakeCase", pure: true, evaluate: (str: string) => simpleWordSplit(str).join("_") },
  {
    name: "toCamelCase",
    pure: true,
    evaluate: (str: string) => connectedWordSplit(str).map((word, i) => (i === 0 ? word : capitalize(word))).join("")
  },
  { name: "trim", pure: true, evaluate: (str: string) => str.trim() },
  { name: "trimLeft", pure: true, evaluate: (str: string) => str.trimStart() },
  { name: "trimRight", pure: true, evaluate: (str: string) => str.trimEnd() },
  { name: "replace", pure: true, evaluate: (val: string, orig: string, repl?: string) => val.split(orig).join(repl || "") }
];
