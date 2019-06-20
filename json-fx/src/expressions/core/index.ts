import { FxExpressionDefinition } from "../../defs";
import { exprArray } from "./expr-array";
import { exprComparative } from "./expr-comparative";
import { exprArithmetic } from "./expr-arithmetic";
import { exprConditional } from "./expr-conditional";
import { exprLogical } from "./expr-logical";
import { exprString } from "./expr-string";
import { exprError } from "./expr-error";

export const coreExpressions: ReadonlyArray<FxExpressionDefinition> = []
.concat(exprArithmetic)
.concat(exprArray)
.concat(exprComparative)
.concat(exprConditional)
.concat(exprLogical)
.concat(exprString)
.concat(exprError);
