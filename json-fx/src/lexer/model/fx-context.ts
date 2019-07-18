import { Loader } from "../loader";

export class FxContext {
  public readonly loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }
}
