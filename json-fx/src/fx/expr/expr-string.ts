import { FxExpressionDefinition } from "../../model/fx-definition";

function wordSplit(str: string): string[] {
  const words = [""];
  let lastChar: string;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const isDelimiter = /[^a-zA-Z0-9]/.test(char);

    if (words[words.length - 1] && (isDelimiter || lastChar && (lastChar == lastChar.toLowerCase()) && (char == char.toUpperCase()))) {
      words.push("");
    }

    if (!isDelimiter) {
      words[words.length - 1] += char.toLowerCase();
    }

    lastChar = char;
  }

  return words.filter(w => !!w);
}

export const ExprString: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "substr",
    evaluate: (str: string, from: number, length: number) => str.substr(from, length)
  },
  {
    name: "substring",
    evaluate: (str: string, from: number, length: number) => str.substring(from, length)
  },
  {
    name: "startsWith",
    evaluate: (str: string, test: string) => str.startsWith(test)
  },
  {
    name: "endsWith",
    evaluate: (str: string, test: string) => str.endsWith(test)
  },
  {
    name: "contains",
    evaluate: (str: string, test: string) => str.indexOf(test) >= 0
  },
  {
    name: "split",
    evaluate: (str: string, separator: string) => str.split(separator)
  },
  {
    name: "join",
    evaluate: (items: any[], separator: string) => items.join(separator)
  },
  {
    name: "toUpperCase",
    evaluate: (str: string) => str.toUpperCase()
  },
  {
    name: "toLowerCase",
    evaluate: (str: string) => str.toLowerCase()
  },
  {
    // This doesn't work well - if there are series of digits, it puts a space between each.
    // e.g. "1234" -> "1 2 3 4"
    name: "toTitleCase",
    evaluate: (str: string) => {
      return wordSplit(str).map(word => word[0].toUpperCase() + word.substr(1)).join(" ");
    }
  },
  {
    // Same issue as toTitleCase.
    name: "toSnakeCase",
    evaluate: (str: string) => wordSplit(str).join("_")
  },
  {
    name: "toCamelCase",
    evaluate: (str: string) => {
      const words = wordSplit(str);
      let result = "";

      for (let i = 0; i < words.length; i++) {
        if (!words[i]) {
          continue;
        }

        if (i != 0) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        result += words[i];
      }

      return result;
    }
  },
  {
    name: "trim",
    evaluate: (str: string) => str.trim()
  },
  {
    name: "trimLeft",
    evaluate: (str: string) => str.trimLeft()
  },
  {
    name: "trimRight",
    evaluate: (str: string) => str.trimRight()
  },
  {
    name: "replace",
    evaluate: (val, orig, repl) => val.split(orig).join(repl || "")
  }
];
