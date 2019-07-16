import { FxIntrinsicDefinition } from "./fx-definition";
import { ExpressionDef, IdentifierDef, OperatorDef } from "../../../definitions/expression-def";
import { GroupDef } from "../../../definitions/group-def";
import { LambdaDef } from "../../../definitions/lambda-def";
import { NullPropertyDef, PropertyDef } from "../../../definitions/property-def";
import { ObjectDef } from "../../../definitions/object-def";
import { ArrayDef } from "../../../definitions/array-def";
import { TemplateDef, VariableDef } from "../../../definitions/variable-def";
import { CallDef } from "../../../definitions/call-def";
import { NumberLiteralDef, StringLiteralDef } from "../../../definitions/literal-def";

export const intrinsics: FxIntrinsicDefinition[] = [
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
