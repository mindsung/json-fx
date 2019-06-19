import { FxExpressionDefinition } from "../defs";

function wordSplit(str: string): string[] {
  const words = [""];
  let lastChar: string;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const isDelimiter = /[^a-zA-Z0-9]/.test(char);

    if (words[words.length - 1] && (isDelimiter || lastChar && (lastChar === lastChar.toLowerCase()) && (char === char.toUpperCase()))) {
      words.push("");
    }

    if (!isDelimiter) {
      words[words.length - 1] += char.toLowerCase();
    }

    lastChar = char;
  }

  return words;
}

export const exprString: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "substr",
    expression: (str: string, from: number, length: number) => str.substr(from, length)
  },
  {
    name: "split",
    expression: (str: string, separator: string) => str.split(separator)
  },
  {
    name: "uppercase",
    expression: (str: string) => str.toUpperCase()
  },
  {
    name: "lowercase",
    expression: (str: string) => str.toLowerCase()
  },
  {
    name: "titlecase",
    expression: (str: string) => {
      return str.replace(/\b(.)/g, c => c.toUpperCase());
    }
  },
  {
    name: "snakecase",
    expression: (str: string) => wordSplit(str).join("_")
  },
  {
    name: "camelcase",
    expression: (str: string) => {
      const words = wordSplit(str);
      let result = "";

      for (let i = 0; i < words.length; i++) {
        if (!words[i]) {
          continue;
        }

        if (i !== 0) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        result += words[i];
      }

      return result;
    }
  },
  {
    name: "reverse",
    expression: (str: string) => {
      let result = "";

      for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
      }

      return result;
    }
  }
];
