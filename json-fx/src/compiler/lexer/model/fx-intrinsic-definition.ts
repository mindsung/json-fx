import { FxArray } from "../../runtime/model/fx-array";
import { FxIntrinsicDefinition } from "./fx-definition";
import { FxTokenNode } from "./fx-token-node";
import { FxLambda } from "../../runtime/model/fx-lambda";

export const intrinsics: FxIntrinsicDefinition[] = [
  {
    tag: "group",
    optimizer: token => {
      if (token.parent && token.count <= 1) {
        token.unwrap();
      }
    },
    compiler: token => {
      if (token.parent) {
        return new FxArray(token.children.map(c => c.compile()));
      } else {
        return token.first.compile();
      }
    }
  },
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
    operator: {symbol: "=>", precedence: 0},
    optimizer: token => {
      token.tag = "lambda";

      if (token.first.tag != "group") {
        const wrapper = new FxTokenNode("signature");
        wrapper.isLvalue = true;
        token.first.wrap(wrapper);
      } else {
        token.first.tag = "signature";
      }
    },
    compiler: token => {
      const paramNames = token.first.children.map(c => c.symbol);
      return new FxLambda(paramNames, token.last.compile());
    }
  }
];
