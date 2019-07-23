import { AnyFn, FxExpressionDefinition } from "../model/fx-definition";
import { it } from "mocha";
import { assert } from "chai";

export class ExpressionTester {

  private readonly expressions: { [index: string]: FxExpressionDefinition };
  private readonly remaining: string[];

  constructor(expressions: ReadonlyArray<FxExpressionDefinition>) {
    this.remaining = expressions.map(e => e.name);
    this.expressions = expressions.reduce((obj, item) => {
      obj[item.name] = item;
      return obj;
    }, {});
  }

  public get(name: string): AnyFn {
    if (this.expressions[name]) {
      this.removeFromRemaining(name);
      return this.expressions[name].evaluate || null;

    } else {
      return null;
    }
  }

  public done(): void {
    it("[Tests all expressions]", () => {
      assert(this.isComplete(), "Untested expressions: " + this.getRemaining().join(", "));
    });
  }

  public isComplete(): boolean {
    return this.remaining.length == 0;
  }

  public getRemaining(): string[] {
    return this.remaining;
  }

  private removeFromRemaining(name: string): void {
    const index = this.remaining.indexOf(name);
    if (index != -1) {
      this.remaining.splice(index, 1);
    }
  }
}
