import {SourceRef} from "./source-ref";

// TODO: Error.fileName, Error.columnNumber, Error.lineNumber

export abstract class FxError extends Error {

  private readonly _name: string;
  private readonly _message: string;
  public readonly sourceRef: SourceRef;

  protected constructor(prefix: string, message: string, sourceRef?: SourceRef) {
    super(message);
    this._name = prefix;
    this._message = message;
    this.sourceRef = sourceRef;
  }

  public get name(): string {
    return this._name;
  }

  public get message(): string {
    return this._message;
  }

  public toString(): string {
    return this.message;
  }

  public getReferenceString(): string {
    let ref = "";

    if (this.sourceRef) {
      const symbol = this.sourceRef.symbol ? `"${this.sourceRef.symbol}"` : "";
      ref = `${this.sourceRef.line}:${this.sourceRef.index}`;
      // ref = `(${symbol} @ ${this.sourceRef.path}:${this.sourceRef.index})`;
    }

    return ref;
  }
}

export class FxSyntaxError extends FxError {
  constructor(message: string, sourceRef?: SourceRef) { super("Syntax error", message, sourceRef); }
}

export class FxCompileError extends FxError {
  constructor(message: string, sourceRef?: SourceRef) { super("Compilation error", message, sourceRef); }
}
