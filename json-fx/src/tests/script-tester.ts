import { FxInput, JsonFx } from "..";

export class ScriptTester {

  private readonly inputs: any[];
  private readonly fx: JsonFx;

  constructor(...inputs: FxInput[]) {
    this.inputs = inputs;
    this.fx = new JsonFx();
  }

  public input(...inputs: FxInput[]): void {
    this.inputs.push(...inputs);
  }

  public run(script: any): any {
    const compiled = this.fx.compile(script);
    return compiled.evaluate(...this.inputs);
  }
}
