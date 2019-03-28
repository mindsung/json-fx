export interface Operator {
  readonly key: string;
  readonly precedence: number;
  readonly assoc?: "left" | "right";
  readonly isUnary?: boolean;
}
