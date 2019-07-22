import { FxInput, JsonFx } from "..";

export class ScriptTester {

  private readonly data: any[];
  private readonly fx: JsonFx;

  constructor(...data: FxInput[]) {
    this.data = data;
    this.fx = new JsonFx();
  }

  public run(script: any): any {
    const compiled = this.fx.compile(script);
    return compiled.evaluate(...this.data);
  }
}
