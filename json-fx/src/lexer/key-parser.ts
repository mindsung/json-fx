import { FxParser } from "../model/fx-parser";
import { FxNode } from "./node/fx-node";

export class KeyParser implements FxParser<string, FxNode> {



  parse(item: string): FxNode {
    return undefined;
  }
}
