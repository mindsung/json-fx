import { FnCollection } from "./functions/fn-collection";
import { FnComparative } from "./functions/fn-comparative";
import { FnArithmetic } from "./functions/fn-arithmetic";
import { FnConditional } from "./functions/fn-conditional";
import { FnLogical } from "./functions/fn-logical";
import { FnString } from "./functions/fn-string";
import { FnError } from "./functions/fn-error";
import { AnyFn, FxExpressionDefinition, FxIntrinsicDefinition } from "../model/fx-definition";
import { FnJsMath } from "./functions/fn-js-math";
import { GroupDef } from "./def/group-def";
import { ExpressionDef, IdentifierDef, IndexerDef, KeyIndexerDef, OperatorDef } from "./def/expression-def";
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
import { FxSyntaxError } from "../model/fx-error";
import { FnTime } from "./functions/fn-time";
import { FnMisc } from "./functions/fn-misc";

export namespace Fx {

  export const SymbolAssign = ":_kv";
  export const SymbolNegative = "-u";
  export const SymbolLiteral = "'";

  export const TokenRules = _TokenRules;

  export const Functions: ReadonlyArray<FxExpressionDefinition> = []
    .concat(FnArithmetic)
    .concat(FnCollection)
    .concat(FnComparative)
    .concat(FnConditional)
    .concat(FnLogical)
    .concat(FnString)
    .concat(FnTime)
    .concat(FnMisc)
    .concat(FnError)
    .concat(FnJsMath);

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
    new KeyIndexerDef(),
    new StringLiteralDef(),
    new NumberLiteralDef(),
    new LambdaDef(),
    new PropertyDef(),
    new CallDef(),
    new NullPropertyDef(),
    new InvokeDef(),
    new NullInvokeDef(),
    // TODO: Code cleanup
    {
      operator: { symbol: "as", precedence: -3 },
      validator: token => {
        if (!token.below("dynamic")) {
          throw new FxSyntaxError("\"as\" is only valid within a dynamic key declaration", token.sourceRef);
        }
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
      operator: { symbol: ":_kv", precedence: -1 },
    },
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
