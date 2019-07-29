import { SourceRef } from "./source-ref";

export abstract class FxError {

  private readonly prefix: string;
  private readonly _message: string;
  public readonly sourceRef: SourceRef;

  protected constructor(prefix: string, message: string, sourceRef?: SourceRef) {
    this.prefix = prefix;
    this._message = message;
    this.sourceRef = sourceRef;
  }

  public get message(): string {
    return `${ this.prefix }: ${ this._message } ${ this.getReferenceString() }`.trim();
  }

  public toString(): string {
    return this.message;
  }

  private getReferenceString(): string {
    let ref = "";

    if (this.sourceRef) {
      const symbol = this.sourceRef.symbol ? `"${ this.sourceRef.symbol }"` : "";
      ref = `(${ symbol } @ ${ this.sourceRef.path }:${ this.sourceRef.index })`;
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
