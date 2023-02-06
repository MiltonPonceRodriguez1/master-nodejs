import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { routing, appRoutingProviders } from "./app.routing";

import { AppComponent } from './app.component';
import { ArticleNewComponent } from './components/article-new/article-new.component';
import { HomeComponent } from './components/home/home.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleNewComponent,
    HomeComponent,
    ArticleDetailComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
