import { exprArray } from "./expr/expr-array";
import { exprComparative } from "./expr/expr-comparative";
import { exprArithmetic } from "./expr/expr-arithmetic";
import { exprConditional } from "./expr/expr-conditional";
import { exprLogical } from "./expr/expr-logical";
import { exprString } from "./expr/expr-string";
import { exprError } from "./expr/expr-error";
import { FxExpressionDefinition, FxIntrinsicDefinition } from "../lexer/model/fx-definition";
import { exprMath } from "./expr/expr-math";
import { exprRandom } from "./expr/expr-random";
import { GroupDef } from "./def/group-def";
import { ExpressionDef, IdentifierDef, OperatorDef } from "./def/expression-def";
import { ObjectDef } from "./def/object-def";
import { ArrayDef } from "./def/array-def";
import { TemplateDef, VariableDef } from "./def/variable-def";
import { NumberLiteralDef, StringLiteralDef } from "./def/literal-def";
import { LambdaDef } from "./def/lambda-def";
import { NullPropertyDef, PropertyDef } from "./def/property-def";
import { CallDef } from "./def/call-def";

export namespace Fx {

  export const Expressions: FxExpressionDefinition[] = []
    .concat(exprArithmetic)
    .concat(exprArray)
    .concat(exprComparative)
    .concat(exprConditional)
    .concat(exprLogical)
    .concat(exprString)
    .concat(exprError)
    .concat(exprMath)
    .concat(exprRandom);

  export const Intrinsics: FxIntrinsicDefinition[] = [
    new GroupDef(),
    new IdentifierDef(),
    new ObjectDef(),
    new ArrayDef(),
    new VariableDef(),
    new TemplateDef(),
    new OperatorDef(),
    new ExpressionDef(),
    new StringLiteralDef(),
    new NumberLiteralDef(),
    new LambdaDef(),
    new PropertyDef(),
    new CallDef(),
    new NullPropertyDef(),
    {
      operator: { symbol: ",", precedence: -2 },
      optimizer: token => {
        token.unwrap();
      }
    },
    {
      operator: { symbol: ":a", precedence: -1 },
      optimizer: token => {
        token.first.add(token.last);
        token.unwrap();
      }
    },
    {
      operator: { symbol: ":", precedence: 4 },
      optimizer: token => {
        token.last.unshift(token.first);

        if (token.last.tag == "identifier") {
          token.last.tag = "expression";
        }

        token.unwrap();
      }
    },
    {
      operator: { symbol: "?:", precedence: 4 },
      optimizer: token => {
        token.last.unshift(token.first);

        if (token.last.tag == "identifier") {
          token.last.tag = "expression";
        }
      },
      evaluator: {
        name: "nullinvoke",
        deferEvaluation: true,
        evaluate: result => {
          const evalFirstArg = result.args[0].evaluate();
          return evalFirstArg != null ? result.evaluate() : null;
        }
      }
    }
  ];
}
