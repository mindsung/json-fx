import { SourceRef } from "./runtime/source-ref";

export abstract class FxError {

  private readonly _prefix: string;
  private readonly _message: string;
  private readonly _sourceRef: SourceRef;

  public get message(): string {
    const column = this._sourceRef.index >= 0 ? "@ col. " + this._sourceRef.index : "";
    const ref = (this._sourceRef.path + " " + column).trim();

    return `${ this._prefix }: ${ this._message } (${ ref })`;
  }

  public get index(): number {
    return this._sourceRef.index;
  }

  protected constructor(prefix: string, message: string, sourceRef?: SourceRef) {
    this._prefix = prefix;
    this._message = message;
    this._sourceRef = sourceRef;
  }
}

export class FxSyntaxError extends FxError {
  constructor(message: string, index?: number) { super("Syntax error", message, { index: index, symbol: "" }); }
}

export class FxCompileError extends FxError {
  constructor(message: string, sourceRef?: SourceRef) { super("Compilation error", message, sourceRef); }
}
