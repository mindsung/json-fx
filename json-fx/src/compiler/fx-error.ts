export abstract class FxError {

  private readonly _prefix: string;
  private readonly _message: string;
  private readonly _index: number;

  public get message(): string {
    const index = this._index != undefined || this._index < 0 ? " @ col. " + this._index : "";
    return this._prefix + ": " + this._message + index;
  }

  public get index(): number {
    return this._index;
  }

  protected constructor(prefix: string, message: string, index?: number) {
    this._prefix = prefix;
    this._message = message;
    this._index = index;
  }
}

export class FxSyntaxError extends FxError {
  constructor(message: string, index?: number) { super("Syntax error", message, index); }
}

export class FxCompileError extends FxError {
  constructor(message: string, index?: number) { super("Compilation error", message, index); }
}
