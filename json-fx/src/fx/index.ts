import { ExprArray } from "./expr/expr-array";
import { ExprComparative } from "./expr/expr-comparative";
import { ExprArithmetic } from "./expr/expr-arithmetic";
import { ExprConditional } from "./expr/expr-conditional";
import { ExprLogical } from "./expr/expr-logical";
import { ExprString } from "./expr/expr-string";
import { ExprError } from "./expr/expr-error";
import { AnyFn, FxExpressionDefinition, FxIntrinsicDefinition } from "../model/fx-definition";
import { ExprMath } from "./expr/expr-math";
import { ExprRandom } from "./expr/expr-random";
import { GroupDef } from "./def/group-def";
import { ExpressionDef, IdentifierDef, IndexerDef, OperatorDef } from "./def/expression-def";
import { ObjectDef } from "./def/object-def";
import { ArrayDef } from "./def/array-def";
import { TemplateDef, VariableDef } from "./def/variable-def";
import { NumberLiteralDef, StringLiteralDef } from "./def/literal-def";
import { LambdaDef } from "./def/lambda-def";
import { NullPropertyDef, PropertyDef } from "./def/property-def";
import { CallDef } from "./def/call-def";
import { TokenRules as _TokenRules } from "./rules";
import { FxFunction } from "../runtime/fx-function";
import { FxLambda } from "../runtime/fx-lambda";
import { FxExpression } from "../runtime/fx-expression";
import { InvokeDef, NullInvokeDef } from "./def/invoke-def";

export namespace Fx {

  export const SymbolAssign = ":a";
  export const SymbolNegative = "-u";
  export const SymbolLiteral = "'";

  export const TokenRules = _TokenRules;

  export const Expressions: ReadonlyArray<FxExpressionDefinition> = []
    .concat(ExprArithmetic)
    .concat(ExprArray)
    .concat(ExprComparative)
    .concat(ExprConditional)
    .concat(ExprLogical)
    .concat(ExprString)
    .concat(ExprError)
    .concat(ExprMath)
    .concat(ExprRandom);

  export const Intrinsics: ReadonlyArray<FxIntrinsicDefinition> = [
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
      operator: { symbol: "as", precedence: -3 },
      optimizer: token => {
        token.unwrap();
      }
    },
    {
      operator: { symbol: ",", precedence: -2 },
      optimizer: token => {
        token.unwrap();
      }
    },
    {
      operator: { symbol: ":a", precedence: -1 },
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
      // TODO: if/else right-hand associativity
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
