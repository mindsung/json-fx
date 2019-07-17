import { FxExpression } from "./fx-expression";

export class FxArray extends FxExpression {
  public items: FxExpression[];

  constructor(items?: FxExpression[]) {
    super();
    this.items = items || [];
  }

  protected get children(): FxExpression[] { return this.items; }

  evaluate(): any[] {
    return this.items.map(item => item.evaluate());
  }

  bindSourceRefPath(): void {
    this.bindSourceRefPath();

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].sourceRef.path += `[${ i }]`;
      this.items[i].bindSourceRefPath();
    }
  }

  public toString(): string {
    return `[${ this.items.map(item => item.toString()) }]`;
  }
}
