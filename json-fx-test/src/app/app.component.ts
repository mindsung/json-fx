import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {JsonFx} from "@mindsung/json-fx";
import { cryptoExpressions } from "@mindsung/json-fx-crypto";
import {$POKEMON} from "../sample-data/pokemon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public fx: JsonFx;
  public fxScript: string;

  public fxSource: object = $POKEMON;
  public fxResult = new BehaviorSubject("");

  constructor() {
    this.fx = new JsonFx();
    cryptoExpressions.forEach(x => this.fx.define(x));
    this.fxScript = "$";

    window["fx"] = (template: any) => {
      return this.fx.compile(template).evaluate({name: "$", value: this.fxSource});
    };
  }

  ngOnInit() {
    this.onEval();
  }

  public onEval() {
    this.fxResult.next(this.compileScript());
  }

  public getInputScript(): any {
    return this.fxScript.startsWith("{") || this.fxScript.startsWith("[") ? JSON.parse(this.fxScript) : this.fxScript;
  }

  public compileScript(): any {
    const input = this.getInputScript();
    const result = this.fx.compile(input);

    return result.evaluate({name: "$", value: this.fxSource});
  }
}
