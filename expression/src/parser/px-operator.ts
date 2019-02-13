export class PxOperator {
    constructor(public symbol: string, public expr: string, public precedence: number, public assoc: "left" | "right" = "left") {
    }
}
