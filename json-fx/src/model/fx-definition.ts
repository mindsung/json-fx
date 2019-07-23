import { FxTokenNode } from "../lexer/node/fx-token-node";
import { FxExpression } from "../runtime/fx-expression";
import { FxTokenTag } from "./fx-token-tag";

export type AnyFn = (...args: any[]) => any;

export interface FxDefinition {
  operator?: FxOperatorDefinition;
  evaluator?: FxEvaluatorDefinition;
  optimizer?: (token: FxTokenNode) => void;
  compiler?: (token: FxTokenNode) => FxExpression;
}

export interface FxOperatorDefinition {
  readonly symbol: string;
  readonly precedence: number;
  readonly assoc?: "left" | "right";
  readonly isUnary?: boolean;
}

export interface FxEvaluatorDefinition {
  readonly name: string;
  evaluate?: AnyFn;
  params?: FxParamDefinition[];
  deferEvaluation?: boolean;
}

export interface FxParamDefinition {
  readonly name: string;
  readonly description?: string;
  readonly valueType?: "string" | "number" | "boolean" | "date" | "object" | "array";
}

export interface FxExpressionDefinition extends FxEvaluatorDefinition {
  operator?: FxOperatorDefinition;
}

export interface FxIntrinsicDefinition extends FxDefinition {
  readonly tag?: FxTokenTag;
}
