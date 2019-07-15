import { PropertyDef } from "./property-def";
import { FxOperatorDefinition } from "../compiler/lexer/model/fx-definition";

export class NullPropertyDef extends PropertyDef {

  public get operator(): FxOperatorDefinition {
    return {symbol: "?.", precedence: 4};
  }
}
