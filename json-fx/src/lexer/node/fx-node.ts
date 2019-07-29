export class FxNode {

  private _parent: FxNode;
  private readonly _children: Array<FxNode>;

  constructor() {
    this._parent = null;
    this._children = [];
  }

  public get parent(): this {
    return <this>this._parent;
  }

  public get children(): this[] {
    return <this[]>this._children.concat();
  }

  public get count(): number {
    return this._children.length;
  }

  public get first(): this {
    return <this>(this._children[0] || null);
  }

  public get last(): this {
    return <this>(this._children[this._children.length - 1] || null);
  }

  public add(item: FxNode, at?: number | FxNode): void {
    if (item) {
      at = this.toIndex(at);

      if (at != -1) {
        this._children.splice(at, 0, item);
      } else {
        this._children.push(item);
      }

      item.orphan();
      item._parent = this;
    }
  }

  public remove(at?: number | FxNode): FxNode {
    at = this.toIndex(at);
    let removed: FxNode;

    if (at != -1) {
      removed = this._children.splice(at, 1)[0];
    } else {
      removed = this._children.pop();
    }

    removed._parent = null;
    return removed;
  }

  public orphan(): void {
    if (this._parent) {
      this._parent.remove(this);
    }
  }

  public wrap(wrapper: FxNode): void {
    if (this._parent) {
      this._parent.add(wrapper, this);
    }

    wrapper.add(this);
  }

  public unwrap(): void {
    if (this._parent) {
      while (this._children.length > 0) {
        this._parent.add(this.first, this);
      }
    }

    this.orphan();
  }

  private toIndex(at: number | FxNode): number {
    if (at == undefined) {
      return -1;
    } else if (at instanceof FxNode) {
      at = this._children.indexOf(at);
      return at != -1 ? at : -1;
    } else {
      return at >= 0 && at < this._children.length ? at : -1;
    }
  }
}
