export interface FxExpressionDefinition {
  readonly name: string;
  readonly expression?: FxLambdaFn;
  readonly params?: ReadonlyArray<FxParamDefinition>;
  readonly operator?: FxOperatorDefinition;
  readonly deferEvaluation?: boolean;
}

export interface FxParamDefinition {
  readonly name: string;
  readonly description?: string;
  readonly valueType?: "string" | "number" | "boolean" | "date" | "object" | "array";
}

export interface FxOperatorDefinition {
  readonly symbol: string;
  readonly precedence: number;
  readonly assoc?: "left" | "right";
  readonly isUnary?: boolean;
}

export namespace FxIntrinsic {
  export const Invoke = "invoke";
  export const Lambda = "lambda";
  export const Tuple = "tuple";
}

export type FxLambdaFn = (...args: any[]) => any;
