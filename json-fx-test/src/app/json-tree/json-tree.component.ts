import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: "app-json-tree",
  templateUrl: "./json-tree.component.html",
  styleUrls: ["./json-tree.component.css"]
})
export class JsonTreeComponent implements OnInit {
  private node$: any;
  private type$: string;

  public get node(): any {
    return this.node$;
  }

  @Input()
  public set node(v: any) {
    this.node$ = v;
    this.type$ = this.getValueType(v);
  }

  public get type(): string {
    return this.type$;
  }

  @Input()
  collapsed: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  public getValueType(item: any): string {
    if (Array.isArray(item)) {
      console.log("is array");
      console.log(item);
      return "array";
    } else {
      return typeof item;
    }
  }

  public get keys(): string[] {
    if (this.type === "object" || this.type === "array") {
      return Object.keys(this.node);
    } else {
      return [];
    }
  }

  public getEllipses() {
    const MAX_LENGTH = 32;

    if (this.type === "object") {
      let keys = this.keys.map(item => item + ":").join(", ");

      if (keys.length > MAX_LENGTH) {
        keys = keys.substr(0, MAX_LENGTH - 3).trim();
        if (keys[keys.length - 1] === ",") {
          keys = keys.substr(0, keys.length - 1);
        }

        return keys.substr(0, MAX_LENGTH - 3) + "...";
      } else {
        return keys;
      }
    } else {
      return "...";
    }
  }
}
