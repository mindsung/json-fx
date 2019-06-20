import {FxTokenTag} from "./fx-token-tag";

export interface FxTokenRule {
  tag: FxTokenTag;
  test?: (c: string) => boolean;
  preventMerge?: boolean;
  mergeWith?: string | string[];
}
