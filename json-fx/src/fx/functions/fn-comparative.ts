import { FxExpressionDefinition } from "../../model/fx-definition";

export const FnComparative: ReadonlyArray<FxExpressionDefinition> = [
  {
    name: "eq",
    evaluate: (a, b) => a == b,
    operator: { symbol: "==", precedence: 2 }
  },
  {
    name: "eqq",
    evaluate: (a, b) => a === b,
    operator: { symbol: "===", precedence: 2 }
  },
  {
    name: "neq",
    evaluate: (a, b) => a != b,
    operator: { symbol: "!=", precedence: 2 }
  },
  {
    name: "neqq",
    evaluate: (a, b) => a !== b,
    operator: { symbol: "!==", precedence: 2 }
  },
  {
    name: "gt",
    evaluate: (a, b) => a > b,
    operator: { symbol: ">", precedence: 2 }
  },
  {
    name: "gte",
    evaluate: (a, b) => a >= b,
    operator: { symbol: ">=", precedence: 2 }
  },
  {
    name: "lt",
    evaluate: (a, b) => a < b,
    operator: { symbol: "<", precedence: 2 }
  },
  {
    name: "lte",
    evaluate: (a, b) => a <= b,
    operator: { symbol: "<=", precedence: 2 }
  }
];
