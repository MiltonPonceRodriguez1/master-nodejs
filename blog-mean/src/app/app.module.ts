import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from "./app.routing";

import { AppComponent } from './app.component';
import { ArticleNewComponent } from './components/article-new/article-new.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleNewComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    routing
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
