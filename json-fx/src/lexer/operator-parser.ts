import { FxTokenNode } from "./node/fx-token-node";
import { FxSyntaxError } from "../model/fx-error";
import { FxParser } from "../model/fx-parser";
import { FxOperatorDefinition } from "../model/fx-definition";

export class OperatorParser implements FxParser {

  private operatorStack: FxTokenNode[];
  private outputQueue: FxTokenNode[];

  private current: FxTokenNode;
  private last: FxTokenNode;

  private get stackOperator(): FxOperatorDefinition {
    return this.operatorStack[0] && this.operatorStack[0].operator || null;
  }

  public parse(token: FxTokenNode): void {
    this.initialize();

    if (!OperatorParser.isExpression(token)) { return; }

    for (const child of token.children) {
      this.current = child;

      if (this.current.is("operator")) {
        this.parseOperator();
      } else if (this.last && !this.last.is("operator")) {
        throw new FxSyntaxError("Unexpected token", this.current.sourceRef);
      } else {
        this.parseTerm();
      }

      this.last = this.current;
    }

    while (this.operatorStack.length > 0) {
      this.popOperator();
    }
  }

  private initialize(): void {
    this.operatorStack = [];
    this.outputQueue = [];
    this.current = null;
    this.last = null;
  }

  private static isExpression(token: FxTokenNode): boolean {
    return !!token.children.find(c => c.is("operator"));
  }

  private parseTerm(): void {
    this.outputQueue.push(this.current);

    const stackOp = this.stackOperator;
    if (stackOp && stackOp.isUnary) {
      this.popOperator(1);
    }
  }

  private parseOperator(): void {
    if (this.current.operator.isUnary) {
      this.parseUnary();
    } else {
      this.parseBinary();
    }
  }

  private parseUnary(): void {
    if (this.current.operator.assoc == "right") {
      this.current.add(this.outputQueue.pop());
      this.outputQueue.push(this.current);
    } else {
      this.operatorStack.unshift(this.current);
    }
  }

  private parseBinary(): void {
    const currentOp = this.current.operator;
    let stackOp = this.stackOperator;

    while (stackOp && stackOp.precedence >= currentOp.precedence && currentOp.assoc != "right") {
      this.popOperator();
      stackOp = this.stackOperator;
    }

    this.operatorStack.unshift(this.current);
  }

  private popOperator(operands?: number): void {
    operands = operands || 2;
    const stackTop = this.operatorStack.shift();

    if (this.outputQueue.length >= operands) {
      while (operands--) {
        stackTop.add(this.outputQueue.pop(), 0);
      }
      this.outputQueue.push(stackTop);
    } else {
      throw new Error(`Operator "${ stackTop.operator.symbol }" expects ${ operands } operands, ${ this.outputQueue.length } given`);
    }
  }
}
