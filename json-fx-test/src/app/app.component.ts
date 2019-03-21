import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { fxCompile } from "@mindsung/json-fx";
import { $BOOKS } from "../sample-data/books";
import { $POKEMON } from "../sample-data/pokemon";
import { $LIBRARY } from "../sample-data/library";
import { $WESTWORLD } from "../sample-data/westworld";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public fxScript = "$";
  public fxSource: object = $BOOKS;

  ngOnInit() {
    this.onEval();

    window["$compile"] = (template: any) => fxCompile(template);

    window["$BOOKS"] = $BOOKS;
    window["$POKEMON"] = $POKEMON;
    window["$LIBRARY"] = $LIBRARY;
    window["$WESTWORLD"] = $WESTWORLD;

    window["$toJson"] = JSON.stringify;
    window["$fromJson"] = (json: string) => {
      const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.000Z$/;
      const reviver = (key: string, value: string) => {
        if (typeof value === "string" && dateFormat.test(value)) {
          return new Date(value);
        }
        return value;
      };
      return JSON.parse(json, reviver);
    };
  }

  public fxResult = new BehaviorSubject("");
  private lastScript: string;
  private xform: (...inputs: any[]) => any;

  public onEval() {
    if (this.xform == null || this.fxScript !== this.lastScript) {
      this.xform = fxCompile(this.fxScript.startsWith("{") || this.fxScript.startsWith("[") ? JSON.parse(this.fxScript) : this.fxScript);
    }
    this.fxResult.next(this.xform(this.fxSource));
  }
}
