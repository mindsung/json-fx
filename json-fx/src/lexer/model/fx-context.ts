import { FxLoader } from "../fx-loader";

export class FxContext {
  public readonly loader: FxLoader;

  constructor(loader: FxLoader) {
    this.loader = loader;
  }
}