export class FxNode {

  private _parent: FxNode;
  private readonly _children: Array<FxNode>;

  constructor() {
    this._parent = null;
    this._children = [];
  }

  public get parent() {
    return <this>this._parent;
  }

  public get children() {
    return <this[]>this._children.concat();
  }

  public get count() {
    return this._children.length;
  }

  public get first() {
    return <this>(this._children[0] || null);
  }

  public get last() {
    return <this>(this._children[this._children.length - 1] || null);
  }

  public add(item: FxNode, at?: number | FxNode) {
    if (item) {
      at = this.toIndex(at);

      if (!isNaN(at)) {
        this._children.splice(at, 0, item);
      } else {
        this._children.push(item);
      }

      item.orphan();
      item._parent = this;
    }
  }

  public unshift(item: FxNode) {
    this.add(item, 0);
  }

  public remove(at?: number | FxNode): FxNode {
    at = this.toIndex(at);
    let removed: FxNode;

    if (!isNaN(at) && at >= 0 && at < this._children.length) {
      removed = this._children.splice(at, 1)[0];
    } else {
      removed = this._children.pop();
    }

    removed._parent = null;
    return removed;
  }

  public shift(): FxNode {
    return this.remove(0);
  }

  public orphan() {
    if (this._parent) {
      this._parent.remove(this);
    }
  }

  public wrap(wrapper: FxNode) {
    if (this._parent) {
      this._parent.add(wrapper, this);
    }

    wrapper.add(this);
  }

  public unwrap() {
    if (this._parent) {
      while (this._children.length > 0) {
        this._parent.add(this.first, this);
      }
    }

    this.orphan();
  }

  private toIndex(at: number | FxNode): number {
    if (at == undefined) {
      return NaN;
    } else if (at instanceof FxNode) {
      const i = this._children.indexOf(at);
      return i == -1 ? NaN : i;
    } else {
      return at;
    }
  }
}
