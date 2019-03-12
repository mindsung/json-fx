import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {JsonTreeComponent} from "./json-tree/json-tree.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent, JsonTreeComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
