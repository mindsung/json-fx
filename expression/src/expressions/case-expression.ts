import { Expression } from "../core/expression";

export class CaseExpression<TOut> extends Expression<TOut> {
  constructor(
    protected cases: Array<{ caseIf: Expression<boolean>; caseThen: Expression<TOut> }>,
    protected caseElse: Expression<TOut>
  ) {
    super(true, [cases, caseElse]);
  }

  protected out() {
    for (let i = 0; i < this.cases.length; i++) {
      const c = this.cases[i];
      if (c.caseIf.evaluate() === true) {
        return c.caseThen.evaluate();
      }
    }
    return this.caseElse == null ? null : this.caseElse.evaluate();
  }
}
