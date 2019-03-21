import { Expression } from "..";

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

export const fxStringExpressions: ReadonlyArray<Expression<string>> = [
  {
    key: "substr",
    expression: (str: string, from: number, length: number) => str.substr(from, length)
  },
  {
    key: "uppercase",
    expression: (str: string) => str.toUpperCase()
  },
  {
    key: "lowercase",
    expression: (str: string) => str.toLowerCase()
  },
  {
    key: "titlecase",
    expression: (str: string) => {
      return str.replace(/\b(.)/g, c => c.toUpperCase());
    }
  },
  {
    key: "snakecase",
    expression: (str: string) => wordSplit(str).join("_")
  },
  {
    key: "camelcase",
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
    key: "reverse",
    expression: (str: string) => {
      let result = "";

      for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
      }

      return result;
    }
  }
];
