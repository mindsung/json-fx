export class FxSyntaxError {

  private readonly _message: string;
  private readonly _index: number;

  public get message(): string {
    return this._message + " @ col. " + this._index;
  }

  public get index(): number {
    return this._index;
  }

  constructor(message: string, index: number) {
    this._message = message;
    this._index = index;
  }
}
