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

  return words;
}

export const ExprString: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "substr",
    evaluate: (str: string, from: number, length: number) => str.substr(from, length)
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
    name: "uppercase",
    evaluate: (str: string) => str.toUpperCase()
  },
  {
    name: "lowercase",
    evaluate: (str: string) => str.toLowerCase()
  },
  {
    name: "titlecase",
    evaluate: (str: string) => {
      return wordSplit(str).map(word => word[0].toUpperCase() + word.substr(1)).join(" ");
    }
  },
  {
    name: "snakecase",
    evaluate: (str: string) => wordSplit(str).join("_")
  },
  {
    name: "camelcase",
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
    name: "reverse",
    evaluate: (str: string) => {
      let result = "";

      for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
      }

      return result;
    }
  }
];
