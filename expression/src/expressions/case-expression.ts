import { OldExpression } from "../core/expression";

export class CaseExpression<TOut> extends OldExpression<TOut> {
  constructor(
    protected cases: Array<{ caseIf: OldExpression<boolean>; caseThen: OldExpression<TOut> }>,
    protected caseElse: OldExpression<TOut>
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
