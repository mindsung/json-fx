import { FxOperatorDefinition } from "../../../defs";
import { FxTokenNode } from "./fx-token-node";
import { FxTokenTag } from "./fx-token-tag";
import { FxExpression } from "../../runtime/model/fx-expression";
import { FxArray } from "../../runtime/model/fx-array";

export interface FxIntrinsicDefinition {
  tag: FxTokenTag;
  operator?: FxOperatorDefinition;

  optimize?: (token: FxTokenNode) => void;
  compile?: (token: FxTokenNode) => FxExpression;
}

export const intrinsics: FxIntrinsicDefinition[] = [
  {
    tag: "group",
    optimize: token => {
      if (token.parent && token.count <= 1) {
        token.unwrap();
      }
    },
    compile: token => {
      if (token.parent) {
        return new FxArray(token.children.map(c => c.compile()));
      } else {
        return token.first.compile();
      }
    }
  },
  {
    tag: "delimiter",
    operator: {symbol: ",", precedence: -2},
    optimize: token => {
      token.unwrap();
    }
  },
  // {
  //   tag: "lambda",
  //   operator: { symbol: "=>", precedence: 0 },
  //   optimize: token => {
  //     token.tag = "lambda";
  //
  //     if (token.first.tag != "group") {
  //       const wrapper = new FxTokenNode("signature");
  //       wrapper.isLvalue = true;
  //       token.first.wrap(wrapper);
  //     } else {
  //       token.first.tag = "signature";
  //     }
  //   },
  //   compile: token => {
  //     const paramNames = token.first.children.map(c => c.symbol);
  //     return new FxLambda(paramNames, token.last.compile());
  //   }
  // }
];
