import { FxExpressionDefinition } from "../../defs";
import { exprMath } from "./expr-math";
import { exprRandom } from "./expr-random";

export const mathExpressions: ReadonlyArray<FxExpressionDefinition> = []
.concat(exprMath)
.concat(exprRandom);
