export class FxOperator {
  constructor(public symbol: string, public expr: string, public precedence: number, public assoc: "left" | "right" = "left", public operandOn: "left" | "right" | "both" = "both") {
  }
}
