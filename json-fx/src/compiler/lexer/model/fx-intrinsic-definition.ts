import { FxIntrinsicDefinition } from "./fx-definition";
import { OperatorDef } from "../../../definitions/operator-def";
import { ExpressionDef, IdentifierDef } from "../../../definitions/expression-def";
import { GroupDef } from "../../../definitions/group-def";
import { LambdaDef } from "../../../definitions/lambda-def";
import { PropertyDef } from "../../../definitions/property-def";
import { NullPropertyDef } from "../../../definitions/null-property-def";

export const intrinsics: FxIntrinsicDefinition[] = [
  new GroupDef(),
  new IdentifierDef(),
  new OperatorDef(),
  new ExpressionDef(),
  new LambdaDef(),
  new PropertyDef(),
  new NullPropertyDef(),
  {
    operator: {symbol: ",", precedence: -2},
    optimizer: token => {
      token.unwrap();
    }
  },
  {
    operator: {symbol: ":a", precedence: -1},
    optimizer: token => {
      token.first.add(token.last);
      token.unwrap();
    }
  },
  {
    operator: {symbol: ":", precedence: 4},
    optimizer: token => {
      token.last.unshift(token.first);

      if (token.last.tag == "identifier") {
        token.last.tag = "expression";
      }

      token.unwrap();
    }
  },
  {
    operator: {symbol: "?:", precedence: 4},
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
