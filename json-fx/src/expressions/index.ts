import { FxExpressionDefinition } from "../defs";
import { exprArray } from "./expr-array";
import { exprComparative } from "./expr-comparative";
import { exprArithmetic } from "./expr-arithmetic";
import { exprConditional } from "./expr-conditional";
import { exprLogical } from "./expr-logical";
import { exprMath } from "./expr-math";
import { exprString } from "./expr-string";
import { exprRandom } from "./expr-random";
import { exprError } from "./expr-error";

export namespace JsonFx {
  export const expressions: ReadonlyArray<FxExpressionDefinition> = []
    .concat(exprArithmetic)
    .concat(exprArray)
    .concat(exprComparative)
    .concat(exprConditional)
    .concat(exprLogical)
    .concat(exprMath)
    .concat(exprRandom)
    .concat(exprString)
    .concat(exprError);
}
