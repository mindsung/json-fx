import { exprArray } from "./expr/expr-array";
import { exprComparative } from "./expr/expr-comparative";
import { exprArithmetic } from "./expr/expr-arithmetic";
import { exprConditional } from "./expr/expr-conditional";
import { exprLogical } from "./expr/expr-logical";
import { exprString } from "./expr/expr-string";
import { exprError } from "./expr/expr-error";
import { AnyFn, FxExpressionDefinition, FxIntrinsicDefinition } from "../lexer/model/fx-definition";
import { exprMath } from "./expr/expr-math";
import { exprRandom } from "./expr/expr-random";
import { GroupDef } from "./def/group-def";
import { ExpressionDef, IdentifierDef, IndexerDef, OperatorDef } from "./def/expression-def";
import { ObjectDef } from "./def/object-def";
import { ArrayDef } from "./def/array-def";
import { TemplateDef, VariableDef } from "./def/variable-def";
import { NumberLiteralDef, StringLiteralDef } from "./def/literal-def";
import { LambdaDef } from "./def/lambda-def";
import { NullPropertyDef, PropertyDef } from "./def/property-def";
import { CallDef } from "./def/call-def";
import { StringLiteralSymbol as _StringLiteralSymbol, TokenRules as _TokenRules } from "./lexer";
import { FxFunction } from "../runtime/model/fx-function";
import { FxLambda } from "../runtime/model/fx-lambda";
import { FxExpression } from "../runtime/model/fx-expression";
import { InvokeDef, NullInvokeDef } from "./def/invoke-def";

export namespace Fx {

  export const StringLiteralSymbol = _StringLiteralSymbol;
  export const TokenRules = _TokenRules;

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
    new IndexerDef(),
    new StringLiteralDef(),
    new NumberLiteralDef(),
    new LambdaDef(),
    new PropertyDef(),
    new CallDef(),
    new NullPropertyDef(),
    new InvokeDef(),
    new NullInvokeDef(),
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
    // TODO: Code cleanup
    {
      operator: { symbol: "for", precedence: 0.2 },
    },
    {
      operator: { symbol: "in", precedence: 0.2 },
      compiler: token => {
        const lambdaNode = token.first.first;
        const varName = token.first.last;
        const arrNode = token.last;

        const lambdaExpr = new FxLambda([varName.symbol], lambdaNode.compile());
        return new FxFunction((arr: any[], lambda: AnyFn) => arr.map(lambda), [arrNode.compile(), lambdaExpr]);
      }
    },
    {
      operator: { symbol: "if", precedence: 0.1 },
    },
    {
      operator: { symbol: "else", precedence: 0.1 },
      compiler: token => {
        const conditionNode = token.first.last;
        const thenNode = token.first.first;
        const elseNode = token.last;

        const result = new FxFunction();
        result.deferEvaluation = true;
        result.args = [conditionNode.compile(), thenNode.compile(), elseNode.compile()];

        result.evaluator = (cond: FxExpression, thenYield: FxExpression, elseYield: FxExpression) => {
          if (cond.evaluate()) {
            return thenYield.evaluate();
          } else {
            return elseYield.evaluate();
          }
        };

        return result;
      }
    }
  ];
}
