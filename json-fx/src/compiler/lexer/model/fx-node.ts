export class FxNode<T = any> {

  private _parent: FxNode;
  private readonly _children: Array<FxNode>;

  protected data: T;

  constructor(data?: T) {
    this._parent = null;
    this._children = [];

    this.data = data || null;
  }

  public get parent() {
    return <this>this._parent;
  }

  public get children() {
    return <this[]>this._children.concat();
  }

  public get firstChild() {
    return <this>(this._children[0] || null);
  }

  public get lastChild() {
    return <this>(this._children[this._children.length - 1] || null);
  }

  public pushChild(child: FxNode) {
    if (child) {
      this.makeParentTo(child);
      this._children.push(child);

      this.onChildrenChanged();
    }
  }

  public unshiftChild(child: FxNode) {
    if (child) {
      this.makeParentTo(child);
      this._children.unshift(child);

      this.onChildrenChanged();
    }
  }

  public insertChildAfterTarget(child: FxNode, target: FxNode) {
    if (child && target) {
      const insertIndex = this._children.indexOf(target);

      if (insertIndex !== -1) {
        this.makeParentTo(child);
        this._children.splice(insertIndex, 0, child);

        this.onChildrenChanged();

      } else {
        throw new Error("Target is not a child of this node");
      }
    }
  }

  private makeParentTo(child: FxNode) {
    child.orphan();
    child._parent = this;
  }

  public popChild() {
    const child = this._children.pop();

    if (child) {
      child._parent = null;
      this.onChildrenChanged();
    }

    return <this>child;
  }

  public shiftChild() {
    const child = this._children.shift();

    if (child) {
      child._parent = null;
      this.onChildrenChanged();
    }

    return <this>child;
  }

  public transferChildrenTo(target: FxNode, unshift: boolean = true) {
    if (this.childCount > 0) {
      while (this.childCount > 0) {
        if (unshift) {
          target.unshiftChild(this.popChild());
        } else {
          target.pushChild(this.shiftChild());
        }
      }

      this.onChildrenChanged();
    }
  }

  public orphan() {
    if (this._parent) {
      const children = this._parent._children;
      children.splice(children.indexOf(this), 1);
    }

    this._parent = null;
  }

  public get childCount() {
    return this._children.length;
  }

  public wrap(wrapper: FxNode) {
    if (this.parent) {
      this.parent.insertChildAfterTarget(wrapper, this);
    }
    wrapper.pushChild(this);
  }

  public unwrap() {
    if (this._parent) {
      while (this._children.length > 0) {
        this._parent.insertChildAfterTarget(this.firstChild, this);
      }
    }

    this.orphan();
  }

  protected onChildrenChanged() {
  }
}
