import { FxParser } from "./model/fx-parser";
import { FxTokenNode } from "./model/fx-token-node";

export class Optimizer implements FxParser<FxTokenNode, void> {

  parse(root: FxTokenNode): void {
    root.optimize();
  }
}
