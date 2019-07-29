import { FxTokenNode } from "../../lexer/node/fx-token-node";
import { FxExpression } from "../../runtime/fx-expression";
import { FxCompileError } from "../../model/fx-error";
import { FxTokenTag } from "../../model/fx-token-tag";
import { FxDef } from "../../model/fx-def";
import { FxFunction } from "../../runtime/fx-function";
import { FxConstant } from "../../runtime/fx-constant";
import { FxEvaluatorDefinition } from "../../model/fx-definition";

export class ExpressionDef extends FxDef {

  public get tag(): FxTokenTag {
    return "expression";
  }

  protected compile(token: FxTokenNode): FxExpression {
    const evaluator = token.evaluator;

    if (!evaluator) {
      throw new FxCompileError(`Expression "${ token.symbol }" is undefined`, null);
    }

    const result = new FxFunction(evaluator.evaluate);
    result.args = token.children.map(child => child.compile());
    result.deferEvaluation = evaluator.deferEvaluation;

    return result;
  }
}

export class IdentifierDef extends ExpressionDef {

  public get tag(): FxTokenTag {
    return "identifier";
  }

  protected compile(token: FxTokenNode): FxExpression {
    if (token.evaluator) {
      return super.compile(token);
    } else {
      return new FxConstant(IdentifierDef.parseConstant(token.symbol));
    }
  }

  private static parseConstant(symbol: string): any {
    switch (symbol) {
      case "true":
        return true;
      case "false":
        return false;
      case "null":
        return null;
      case "undefined":
        return undefined;
      default:
        return symbol;
    }
  }
}

export class OperatorDef extends ExpressionDef {
  public get tag(): FxTokenTag {
    return "operator";
  }
}

export class IndexerDef extends FxDef {
  public get tag(): FxTokenTag {
    return "indexer";
  }

  protected compile(token: FxTokenNode): FxExpression {
    const arrToken = token.first;
    const indexerToken = token.last;

    if (indexerToken.is("group")) {
      return new FxFunction((collection, ...indices) => {
        return indices.map(i => collection[i]);
      }, [arrToken.compile(), ...indexerToken.children.map(c => c.compile())]);
    } else {
      return new FxFunction((collection, index) => {
        return collection[index];
      }, [arrToken.compile(), indexerToken.compile()]);
    }
  }
}

export class KeyIndexerDef extends FxDef {
  public get tag(): FxTokenTag {
    return "key-indexer";
  }

  protected compile(token: FxTokenNode): FxExpression {
    const objToken = token.first;
    const propToken = token.last;

    const args = [objToken.compile()];

    if (propToken.is("group")) {
      args.push(...propToken.children.map(c => c.compile()));
    } else {
      args.push(propToken.compile());
    }

    return new FxFunction((obj, ...keys) => {
      const result = {};
      for (const key of keys) {
        result[key] = obj[key];
      }
      return result;
    }, args);
  }
}
