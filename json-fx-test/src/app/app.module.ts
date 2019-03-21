import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { JsonTreeComponent } from "./json-tree/json-tree.component";
import { FormsModule } from "@angular/forms";
import { ExpressionSet } from "@mindsung/json-fx";
import { fxCryptoExpressions } from "@mindsung/json-fx-crypto";

ExpressionSet.addDefaultExpressions(fxCryptoExpressions);

@NgModule({
  declarations: [AppComponent, JsonTreeComponent],
  exports: [JsonTreeComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
