import { FxTokenTag } from "./fx-token-tag";

export interface FxToken {
  tag: FxTokenTag;

  symbol?: string;
  line?: number;
  index?: number;
  children?: FxToken[];
}
