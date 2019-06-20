import {FxTokenTag} from "./fx-token-tag";

export interface FxToken {
  symbol: string;
  tag: FxTokenTag;
  index: number;
}
