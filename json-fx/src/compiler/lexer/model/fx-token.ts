import { FxTokenTag } from "./fx-token-tag";

export interface FxToken {
  tag: FxTokenTag;

  symbol?: string;
  index?: number;
  children?: FxToken[];
}
